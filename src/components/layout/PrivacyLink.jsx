import { PRIVACY_PATH } from '../../constants'

/** Opens the privacy page without reloading, so an ongoing chat isn't lost. */
export default function PrivacyLink({ className = '', children = 'Privacy policy' }) {
  function open(e) {
    e.preventDefault()
    history.pushState(null, '', PRIVACY_PATH)
    dispatchEvent(new PopStateEvent('popstate'))
  }

  return (
    <a href={PRIVACY_PATH} onClick={open} className={`underline underline-offset-2 ${className}`}>
      {children}
    </a>
  )
}
