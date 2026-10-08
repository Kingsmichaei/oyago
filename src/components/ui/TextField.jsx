const BASE =
  'w-full rounded-xl bg-tar px-4 py-3 outline-none placeholder:text-chalk/40 focus:ring-2 focus:ring-danfo'

export function TextField({ className = '', ...props }) {
  return <input className={`${BASE} ${className}`} {...props} />
}

export function TextArea({ className = '', ...props }) {
  return <textarea className={`${BASE} ${className}`} {...props} />
}
