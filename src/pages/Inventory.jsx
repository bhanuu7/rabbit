import { useState } from "react";
import { useStore } from "../context/StoreContext";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Badge } from "../components/ui/badge";
import { toast } from "sonner";
import {
  ArrowLeft,
  Package,
  ShoppingBag,
  Bell,
  Plus,
  Pencil,
  Trash2,
  Save,
  TriangleAlert,
} from "lucide-react";
import { getOrders } from "@/api/getOrders";
import { OrderDetailsDialog } from "@/components/OrderDetailsDialog";
import { updateProduct as updateProductAPI } from "@/api/updateProducts";
import { getNotifyRequests } from "@/api/getNotifyRequests";
import { uploadData } from "aws-amplify/storage";

export default function Inventory() {
  const { data: ordersData = [] } = getOrders();
  const { data: notifyRequests = [] } = getNotifyRequests();
  const {
    products,
    reservations,
    updateProduct,
    deleteProduct,
    addProduct,
    updateProductStock,
  } = useStore();
  const { mutate: updateProductsFn } = updateProductAPI();
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [orderDetailsDialog, setOrderDetailsDialog] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    price: null,
    description: "",
    image: "",
    stock: null,
    alcoholContent: "",
    volume: "",
    origin: "",
  });
  const [preview, setPreview] = useState(null);

  const outOfStockItems = Object.values(products).filter(
    (product) => product.stock_count === 0,
  );
  const runningOutOfStockItems = Object.values(products).filter(
    (product) => product.stock_count <= 5 && product.stock_count > 0,
  );

  const FALLBACK_CATEGORIES = [
    "Wine",
    "Whiskey",
    "Beer",
    "Rum",
    "Vodka",
    "Tequila",
    "Champagne",
    "Gin",
    "Cognac",
    "Scotch",
  ];
  const availableCategories = Array.from(
    new Set([
      ...FALLBACK_CATEGORIES,
      ...Object.values(products)
        .map((p) => p.category)
        .filter(Boolean),
    ]),
  ).sort();

  const uploadImage = async (file) => {
    try {
      const fileName = `products/${Date.now()}-${file.name}`;

      const result = await uploadData({
        path: fileName,
        data: file,
        options: {
          contentType: file.type,
        },
      }).result;
      // construct URL
      setNewProduct((prev) => ({
        ...prev,
        image: fileName,
      }));
    } catch (error) {
      console.error("Upload failed", error);
    }
  };

  const handleUpdateStock = (productId, newStock) => {
    updateProductStock(productId, newStock);
    toast.success("Stock updated successfully", { position: "top-center" });
  };

  const handleEditProduct = (product) => {
    setEditingProduct({ ...product });
  };

  const handleSaveEdit = () => {
    try {
      if (!editingProduct) return;

      // const res = await updateProductApi(editingProduct);

      // Optional: update local state/store
      updateProductsFn(editingProduct);
      // updateProduct(editingProduct.id, res.product);

      setEditingProduct(null);
      toast.success("Product updated successfully", { position: "top-center" });
    } catch (error) {
      console.error(error);
      toast.error("Failed to update product", { position: "top-center" });
    }
  };

  const handleDeleteProduct = (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      deleteProduct(productId);
      toast.success("Product deleted", { position: "top-center" });
    }
  };

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.category || !newProduct.price) {
      toast.error("Please fill in all required fields", {
        position: "top-center",
      });
      return;
    }
    console.log(newProduct);
    addProduct(newProduct);
    console.log("products", products);
    setAddDialogOpen(false);
    setNewProduct({
      name: "",
      category: "",
      price: 0,
      description: "",
      image: "",
      stock: 0,
      alcoholContent: "",
      volume: "",
      origin: "",
    });
    setPreview("");
    toast.success("Product added successfully", { position: "top-center" });
  };

  const handleCloseOrderDetailsDialog = () => {
    setOrderDetailsDialog(false);
    setSelectedOrderId(null);
  };

  const FormattedBadge = ({ status }) => {
    if (status === "picked_up")
      return (
        <Badge className="bg-[rgba(34,197,94,0.1)] text-green-400 border border-[rgba(34,197,94,0.3)] rounded-full text-[11px] font-semibold">
          Complete
        </Badge>
      );
    else if (status === "order_placed")
      return (
        <Badge className="bg-[rgba(59,130,246,0.1)] text-blue-400 border border-[rgba(59,130,246,0.3)] rounded-full text-[11px] font-semibold">
          Active
        </Badge>
      );
    return (
      <Badge className="bg-[rgba(239,68,68,0.1)] text-red-400 border border-[rgba(239,68,68,0.3)] rounded-full text-[11px] font-semibold">
        Cancelled
      </Badge>
    );
  };

  const handleOrderDetailsDialogClick = (orderId) => {
    setSelectedOrderId(orderId);
    setOrderDetailsDialog(!orderDetailsDialog);
  };

  const pendingReservations = reservations.filter(
    (r) => r.status === "pending",
  );
  const totalRevenue = reservations
    .filter((r) => r.status === "completed")
    .reduce((sum, r) => {
      const product = products.find((p) => p.id === r.productId);
      return sum + (product ? product.price * r.quantity : 0);
    }, 0);

  const handleImageCapture = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    // preview (optional)
    const previewUrl = URL.createObjectURL(file);
    console.log("handle Image capture triggered", previewUrl);
    setPreview(previewUrl);

    // upload
    await uploadImage(file);
  };

  return (
    <div className="min-h-screen bg-bg-base text-text-main font-sans-app px-4 py-8">
      {/* Stats */}
      <div className="mb-8 grid gap-4 md:grid-cols-4">
        <Card className="bg-bg-card border-[rgba(201,168,76,0.18)] hover:border-[rgba(201,168,76,0.4)] transition-all duration-[280ms]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-[11px] uppercase tracking-[1.5px] text-[#5c6670] font-sans-app font-semibold">
              Total Products
            </CardTitle>
            <Package className="w-4 h-4 text-gold opacity-70" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#2d333a] font-serif-app">
              {products.length}
            </div>
            <p className="text-[11px] text-[#6b7681] mt-1">
              {outOfStockItems.length} out of stock
            </p>
          </CardContent>
        </Card>
        <Card className="bg-bg-card border-[rgba(201,168,76,0.18)] hover:border-[rgba(201,168,76,0.4)] transition-all duration-[280ms]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-[11px] uppercase tracking-[1.5px] text-[#5c6670] font-sans-app font-semibold">
              Running Out
            </CardTitle>
            <TriangleAlert className="w-4 h-4 text-gold opacity-70" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#2d333a] font-serif-app">
              {runningOutOfStockItems.length}
            </div>
            <p className="text-[11px] text-[#6b7681] mt-1">
              {runningOutOfStockItems.length} might go out of stock
            </p>
          </CardContent>
        </Card>
        <Card className="bg-bg-card border-[rgba(201,168,76,0.18)] hover:border-[rgba(201,168,76,0.4)] transition-all duration-[280ms]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-[11px] uppercase tracking-[1.5px] text-[#5c6670] font-sans-app font-semibold">
              Reservations
            </CardTitle>
            <ShoppingBag className="w-4 h-4 text-gold opacity-70" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#2d333a] font-serif-app">
              {ordersData.length}
            </div>
            <p className="text-[11px] text-[#6b7681] mt-1">
              {ordersData.length} total reservations
            </p>
          </CardContent>
        </Card>
        <Card className="bg-bg-card border-[rgba(201,168,76,0.18)] hover:border-[rgba(201,168,76,0.4)] transition-all duration-[280ms]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-[11px] uppercase tracking-[1.5px] text-[#5c6670] font-sans-app font-semibold">
              Notify Requests
            </CardTitle>
            <Bell className="w-4 h-4 text-gold opacity-70" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#2d333a] font-serif-app">
              {notifyRequests.length}
            </div>
            <p className="text-[11px] text-[#6b7681] mt-1">
              Customers waiting for restock
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="products" className="space-y-4">
        <TabsList className="bg-bg-card border border-[rgba(45,51,58,0.14)] p-1 rounded-lg h-auto gap-1 [&>[data-state=active]]:bg-gold [&>[data-state=active]]:text-white [&>[data-state=inactive]]:text-[#6b7681] [&>[data-state=inactive]]:hover:text-gold">
          <TabsTrigger
            value="products"
            className="text-[12px] tracking-[0.8px] uppercase font-semibold px-4 py-2 rounded-md transition-all duration-[280ms] cursor-pointer"
          >
            Products
          </TabsTrigger>
          <TabsTrigger
            value="reservations"
            className="text-[12px] tracking-[0.8px] uppercase font-semibold px-4 py-2 rounded-md transition-all duration-[280ms] cursor-pointer"
          >
            Reservations
          </TabsTrigger>
          <TabsTrigger
            value="notify"
            className="text-[12px] tracking-[0.8px] uppercase font-semibold px-4 py-2 rounded-md transition-all duration-[280ms] cursor-pointer"
          >
            Notify Requests
          </TabsTrigger>
        </TabsList>

        {/* Products Tab */}
        <TabsContent value="products" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white font-serif-app tracking-wide">
              Product Management
            </h2>
            <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-br from-gold to-[#a8461f] text-white border-none hover:from-[#d97a5c] hover:to-gold hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(209,112,79,0.3)] transition-all duration-[280ms]">
                  <Plus className="w-4 h-4" />
                  Add Product
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-bg-card border border-[rgba(45,51,58,0.16)] text-text-main max-h-[80vh] overflow-y-auto sm:max-w-lg mt-8 top-[48%] [&_[data-slot=dialog-close]]:text-[#6b7681] [&_[data-slot=dialog-close]:hover]:text-gold [&_[data-slot=dialog-close]:hover]:bg-[rgba(209,112,79,0.1)]">
                <DialogHeader>
                  <DialogTitle className="text-white font-serif-app text-lg tracking-wide">
                    Add New Product
                  </DialogTitle>
                  <DialogDescription className="text-[#6b7681] text-[13px]">
                    Enter the details for the new product
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-2">
                  {[
                    {
                      label: "Name *",
                      key: "name",
                      type: "text",
                      placeholder: "",
                    },
                    {
                      label: "Price *",
                      key: "price",
                      type: "number",
                      placeholder: "",
                    },
                    {
                      label: "Stock",
                      key: "stock",
                      type: "number",
                      placeholder: "",
                    },
                    {
                      label: "Alcohol Content",
                      key: "alcoholContent",
                      type: "text",
                      placeholder: "40%",
                    },
                    {
                      label: "Volume",
                      key: "volume",
                      type: "text",
                      placeholder: "750ml",
                    },
                    {
                      label: "Origin",
                      key: "origin",
                      type: "text",
                      placeholder: "",
                    },
                  ].map(({ label, key, type, placeholder }) => (
                    <div key={key}>
                      <Label className="text-[11px] uppercase tracking-[1.2px] text-gold mb-1.5 block">
                        {label}
                      </Label>
                      <Input
                        type={type}
                        placeholder={placeholder}
                        value={newProduct[key]}
                        onChange={(e) =>
                          setNewProduct({
                            ...newProduct,
                            [key]: e.target.value,
                          })
                        }
                        className="bg-[rgba(45,51,58,0.04)] border-[rgba(45,51,58,0.16)] text-text-main focus-visible:ring-0 focus-visible:border-gold text-[13px] placeholder:text-text-dim font-sans-app"
                      />
                    </div>
                  ))}
                  <div>
                    <Label className="text-[11px] uppercase tracking-[1.2px] text-gold mb-1.5 block">
                      Image
                    </Label>
                    <Input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handleImageCapture}
                      className="bg-[rgba(45,51,58,0.04)] border-[rgba(45,51,58,0.16)] text-text-main focus-visible:ring-0 focus-visible:border-gold text-[13px] placeholder:text-text-dim font-sans-app"
                    />
                    {preview && (
                      <div className="mt-2">
                        <img
                          src={preview}
                          alt="preview"
                          className="w-full h-40 object-cover rounded-md border border-[rgba(201,168,76,0.22)]"
                        />
                      </div>
                    )}
                  </div>
                  <div>
                    <Label className="text-[11px] uppercase tracking-[1.2px] text-gold mb-1.5 block">
                      Category *
                    </Label>
                    <select
                      value={newProduct.category}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          category: e.target.value,
                        })
                      }
                      className="w-full bg-[rgba(45,51,58,0.04)] border border-[rgba(45,51,58,0.16)] rounded-md px-3 py-2 text-[13px] text-text-main outline-none transition-all duration-[280ms] focus:border-gold focus:bg-[rgba(209,112,79,0.06)] font-sans-app cursor-pointer appearance-none"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23c25a3a' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "right 12px center",
                      }}
                    >
                      <option
                        value=""
                        disabled
                        className="bg-[#fbf5ea] text-[#8a94a0]"
                      >
                        Select a category…
                      </option>
                      {availableCategories.map((cat) => (
                        <option
                          key={cat}
                          value={cat}
                          className="bg-[#fbf5ea] text-[#3a424b]"
                        >
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label className="text-[11px] uppercase tracking-[1.2px] text-gold mb-1.5 block">
                      Description
                    </Label>
                    <Textarea
                      value={newProduct.description}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          description: e.target.value,
                        })
                      }
                      rows={3}
                      className="bg-[rgba(45,51,58,0.04)] border-[rgba(45,51,58,0.16)] text-text-main focus-visible:ring-0 focus-visible:border-gold text-[13px] placeholder:text-text-dim font-sans-app resize-none"
                    />
                  </div>
                </div>
                <DialogFooter className="gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setAddDialogOpen(false)}
                    className="border-[rgba(45,51,58,0.16)] text-[#6b7681] bg-transparent hover:text-gold hover:border-gold hover:bg-[rgba(209,112,79,0.1)]"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddProduct}
                    className="bg-gradient-to-br from-gold to-[#a8461f] text-white border-none hover:from-[#d97a5c] hover:to-gold"
                  >
                    Add Product
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <Card className="bg-bg-card border-[rgba(201,168,76,0.18)]">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-[rgba(201,168,76,0.18)] hover:bg-transparent">
                    <TableHead className="text-[10px] uppercase tracking-[1.5px] text-gold font-semibold">
                      Product
                    </TableHead>
                    <TableHead className="text-[10px] uppercase tracking-[1.5px] text-gold font-semibold">
                      Category
                    </TableHead>
                    <TableHead className="text-[10px] uppercase tracking-[1.5px] text-gold font-semibold">
                      Price
                    </TableHead>
                    <TableHead className="text-[10px] uppercase tracking-[1.5px] text-gold font-semibold">
                      Stock
                    </TableHead>
                    <TableHead className="text-[10px] uppercase tracking-[1.5px] text-gold font-semibold text-right">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow
                      key={product.id}
                      className="border-b border-[rgba(201,168,76,0.08)] hover:bg-[rgba(201,168,76,0.03)]"
                    >
                      <TableCell className="text-text-main">
                        {editingProduct?.id === product.id ? (
                          <Input
                            value={editingProduct.item_name}
                            onChange={(e) =>
                              setEditingProduct({
                                ...editingProduct,
                                item_name: e.target.value,
                              })
                            }
                            className="bg-[rgba(45,51,58,0.04)] border-[rgba(45,51,58,0.18)] text-text-main focus-visible:ring-0 focus-visible:border-gold text-[13px]"
                          />
                        ) : (
                          <div className="flex items-center gap-3">
                            <img
                              src={product.imageSignedUrl}
                              alt={product.item_name}
                              className="w-9 h-9 rounded object-contain opacity-90"
                            />
                            <span className="text-[13px]">
                              {product.item_name}
                            </span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-[#6b7681] text-[13px] text-left ">
                        {editingProduct?.id === product.id ? (
                          <Input
                            value={editingProduct.category}
                            onChange={(e) =>
                              setEditingProduct({
                                ...editingProduct,
                                category: e.target.value,
                              })
                            }
                            className="bg-[rgba(45,51,58,0.04)] border-[rgba(45,51,58,0.18)] text-text-main focus-visible:ring-0 focus-visible:border-gold text-[13px]"
                          />
                        ) : (
                          product.category
                        )}
                      </TableCell>
                      <TableCell className="text-[13px] text-left ">
                        {editingProduct?.id === product.id ? (
                          <Input
                            type="number"
                            value={editingProduct.price}
                            onChange={(e) =>
                              setEditingProduct({
                                ...editingProduct,
                                price: parseFloat(e.target.value) || 0,
                              })
                            }
                            className="bg-[rgba(45,51,58,0.04)] border-[rgba(45,51,58,0.18)] text-text-main focus-visible:ring-0 focus-visible:border-gold text-[13px] w-24"
                          />
                        ) : (
                          <span className="text-gold font-semibold font-serif-app">
                            ${product.price}
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-left">
                        {editingProduct?.id === product.id ? (
                          <Input
                            type="number"
                            value={editingProduct.stock_count}
                            onChange={(e) =>
                              setEditingProduct({
                                ...editingProduct,
                                stock_count: parseInt(e.target.value) || 0,
                              })
                            }
                            className="bg-[rgba(45,51,58,0.04)] border-[rgba(45,51,58,0.18)] text-text-main focus-visible:ring-0 focus-visible:border-gold text-[13px] w-20"
                          />
                        ) : (
                          <Badge
                            className={`rounded-full text-[11px] font-semibold border ${
                              product.stock_count === 0
                                ? "bg-[rgba(239,68,68,0.1)] text-red-400 border-[rgba(239,68,68,0.3)]"
                                : product.stock_count <= 3
                                  ? "bg-[rgba(234,179,8,0.1)] text-yellow-400 border-[rgba(234,179,8,0.3)]"
                                  : "bg-[rgba(201,168,76,0.1)] text-gold border-[rgba(201,168,76,0.3)]"
                            }`}
                          >
                            {product.stock_count}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {editingProduct?.id === product.id ? (
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              onClick={handleSaveEdit}
                              className="bg-[rgba(209,112,79,0.1)] text-gold border border-[rgba(194,90,58,0.3)] hover:bg-[rgba(209,112,79,0.2)] h-7 w-7 p-0"
                            >
                              <Save className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setEditingProduct(null)}
                              className="text-[#6b7681] hover:text-gold hover:bg-[rgba(209,112,79,0.1)] text-[12px] h-7 px-2"
                            >
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEditProduct(product)}
                              className="text-[#6b7681] hover:text-gold hover:bg-[rgba(209,112,79,0.1)] h-7 w-7 p-0"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteProduct(product.id)}
                              className="text-[#6b7681] hover:text-red-400 hover:bg-[rgba(239,68,68,0.08)] h-7 w-7 p-0"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reservations Tab */}
        <TabsContent value="reservations" className="space-y-4">
          <h2 className="text-xl font-bold text-white font-serif-app tracking-wide">
            Reservations
          </h2>
          <Card className="bg-bg-card border-[rgba(201,168,76,0.18)]">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-[rgba(201,168,76,0.18)] hover:bg-transparent">
                    {[
                      "User Name",
                      "Email",
                      "Total Amount",
                      "Status",
                      "Date",
                    ].map((h) => (
                      <TableHead
                        key={h}
                        className="text-[10px] uppercase tracking-[1.5px] text-gold font-semibold"
                      >
                        {h}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ordersData.length === 0 ? (
                    <TableRow className="hover:bg-transparent">
                      <TableCell
                        colSpan={7}
                        className="text-center text-[#555] py-12 text-[13px]"
                      >
                        No reservations yet
                      </TableCell>
                    </TableRow>
                  ) : (
                    ordersData.map((reservation) => (
                      <TableRow
                        key={reservation.id}
                        className="border-b border-[rgba(201,168,76,0.08)] cursor-pointer hover:bg-[rgba(201,168,76,0.04)]"
                        onClick={() =>
                          handleOrderDetailsDialogClick(reservation.id)
                        }
                      >
                        <TableCell className="text-[13px] text-text-main text-left ">
                          {reservation.user_name}
                        </TableCell>
                        <TableCell className="text-[13px] text-[#6b7681] text-left ">
                          {reservation.email}
                        </TableCell>
                        <TableCell className="text-[13px] text-gold font-semibold font-serif-app text-left ">
                          {reservation.bill_amount}
                        </TableCell>
                        <TableCell className="text-left">
                          <FormattedBadge status={reservation.status} />
                        </TableCell>
                        <TableCell className="text-[13px] text-[#888] text-left ">
                          {new Date(
                            reservation.created_at,
                          ).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notify Requests Tab */}
        <TabsContent value="notify" className="space-y-4">
          <h2 className="text-xl font-bold text-white font-serif-app tracking-wide">
            Restock Notifications
          </h2>
          <Card className="bg-bg-card border-[rgba(201,168,76,0.18)]">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-[rgba(201,168,76,0.18)] hover:bg-transparent">
                    {["Email", "Product", "Date Requested", "Status"].map(
                      (h) => (
                        <TableHead
                          key={h}
                          className="text-[10px] uppercase tracking-[1.5px] text-gold font-semibold"
                        >
                          {h}
                        </TableHead>
                      ),
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {notifyRequests.length === 0 ? (
                    <TableRow className="hover:bg-transparent">
                      <TableCell
                        colSpan={4}
                        className="text-center text-[#555] py-12 text-[13px]"
                      >
                        No notification requests
                      </TableCell>
                    </TableRow>
                  ) : (
                    notifyRequests.map((request) => {
                      return (
                        <TableRow
                          key={request.id}
                          className="border-b border-[rgba(201,168,76,0.08)] hover:bg-[rgba(201,168,76,0.03)]"
                        >
                          <TableCell className="text-[13px] text-[#6b7681] text-left">
                            {request.email}
                          </TableCell>
                          <TableCell className="text-[13px] text-text-main text-left">
                            {request?.item_name || "Unknown"}
                          </TableCell>
                          <TableCell className="text-[13px] text-[#888] text-left">
                            {new Date(request.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-left ">
                            <Badge
                              className={`rounded-full text-[11px] font-semibold border ${
                                request?.status.toLowerCase === "pending"
                                  ? "bg-[rgba(239,68,68,0.1)] text-red-400 border-[rgba(239,68,68,0.3)]"
                                  : "bg-[rgba(201,168,76,0.1)] text-gold border-[rgba(201,168,76,0.3)]"
                              }`}
                            >
                              {request.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <OrderDetailsDialog
        key={selectedOrderId}
        open={orderDetailsDialog}
        onClose={handleCloseOrderDetailsDialog}
        orderId={selectedOrderId}
      />
    </div>
  );
}
