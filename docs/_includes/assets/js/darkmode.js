function applyThemeColor () {
  if (localStorage.getItem('darkmode') === 'true' || (!(localStorage.getItem('darkmode')) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    localStorage.setItem('darkmode', 'true')
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

function activateDarkMode() {
  const newDarkModeValue = localStorage.getItem('darkmode') === 'true'
    ? 'false'
    : 'true'

  localStorage.setItem('darkmode', newDarkModeValue)
  applyThemeColor()
}

applyThemeColor()
