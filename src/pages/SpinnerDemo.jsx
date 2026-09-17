import WhiskeySpinner from '../components/WhiskeySpinner'

const s = {
  page: {
    minHeight: '100vh',
    background: '#080808',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '56px',
    fontFamily: "'Helvetica Neue', 'Segoe UI', Arial, sans-serif",
    padding: '40px 24px',
  },
  heading: {
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  pre: {
    color: '#c9a84c',
    fontSize: '0.68rem',
    letterSpacing: '0.28em',
    textTransform: 'uppercase',
    margin: 0,
    opacity: 0.75,
  },
  title: {
    color: '#f5f0e8',
    fontSize: '1.6rem',
    fontWeight: 700,
    margin: 0,
    letterSpacing: '-0.01em',
  },
  row: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: '64px',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  col: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
  },
  sizeLabel: {
    color: 'rgba(245,240,232,0.3)',
    fontSize: '0.68rem',
    letterSpacing: '0.1em',
  },
  divider: {
    width: '1px',
    height: '60px',
    background: 'rgba(201,168,76,0.18)',
  },
}

export default function SpinnerDemo() {
  return (
    <div style={s.page}>
      <div style={s.heading}>
        <p style={s.pre}>Component Preview</p>
        <h1 style={s.title}>Whiskey Pour Spinner</h1>
      </div>

      <div style={s.row}>
        <div style={s.col}>
          <WhiskeySpinner size={70} label="Loading…" />
          <span style={s.sizeLabel}>70 px · Small</span>
        </div>

        <div style={s.divider} />

        <div style={s.col}>
          <WhiskeySpinner size={120} label="Loading…" />
          <span style={s.sizeLabel}>120 px · Default</span>
        </div>

        <div style={s.divider} />

        <div style={s.col}>
          <WhiskeySpinner size={180} label="Please wait" />
          <span style={s.sizeLabel}>180 px · Large</span>
        </div>
      </div>
    </div>
  )
}
