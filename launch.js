// launch.js
delete process.env['BROWSER']
require('react-dev-utils/openBrowser')(process.env.REACT_APP_BASE_API_URL)

