const VARIANTS = {
  primary: 'bg-danfo text-ink font-bold',
  secondary: 'bg-road text-chalk font-semibold',
}

export default function Button({ variant = 'primary', className = '', ...props }) {
  return (
    <button
      className={`rounded-xl px-4 py-3 transition disabled:opacity-40 ${VARIANTS[variant]} ${className}`}
      {...props}
    />
  )
}
