// import { useState } from 'react'
import './App.css'
import AKFDEV_Logo from './assets/AKFDEV_Logo.png'
import packageJson from '../package.json'
import screenshot2 from './docs/screenshot2.png'

function App() {
  // const [count, setCount] = useState(0)

  return (
    <>
      <header>
        <img src={AKFDEV_Logo} alt="AKFDEV Logo" className="logo" />
        <h1>AWS Console Title Bar</h1>
        <p>Making life easier for people managing multiple AWS accounts</p>
      </header>
      <main>
        <section className="features">
          <h2>Features</h2>
          <ul>
            <li>Displays the account name on the AWS Console menu bar</li>
            <li>Supports multiple accounts with SSO</li>
            <li>Easy to install and configure</li>
            <li>Works on Chrome and Firefox</li>
          </ul>
        </section>
        <section className="how-it-works">
          <h2>How It Works</h2>
          <ol>
            <li>Install the plugin from the Chrome Web Store or Firefox Add-ons</li>
            <li>Open the AWS Console</li>
            <li>Click on the plugin icon in the browser's toolbar</li>
            <li>Select "Allow on all AWS Console URLs"</li>
            <li>Enjoy the convenience of easily identifying your AWS accounts</li>
          </ol>
        </section>
        <section className="screenshots">
          <h2>Screenshots</h2>
          <img src={screenshot2} alt="Screenshot Hero" width="50%"/>
          <br/>
          {/* <img src={screenshot2} alt="Screenshot 2" width="50%"/> */}
        </section>
        <section className="description">
          <h2>Product Description</h2>
          <p>The AWS Console Title Bar plugin is designed to help users manage multiple AWS accounts with ease. By displaying the account name prominently on the AWS Console menu bar, users can quickly identify which account they are working in, reducing the risk of errors and improving workflow efficiency. The plugin supports multiple accounts with Single Sign-On (SSO) and is easy to install and configure. Whether you are using Chrome or Firefox, the AWS Console Title Bar plugin is the perfect tool to streamline your AWS account management.</p>
        </section>
        <section className="cta">
          <h2>Get Started</h2>
          <p>Download the AWS Console Title Bar plugin today and simplify your AWS account management!</p>
          <div className="buttons">
            <a href="https://chrome.google.com/webstore/detail/aws-console-title-bar/jhenfbkjfncfbimbkhakchbdefigenfp?hl=en" className="button">Chrome Web Store</a>
            <a href="https://addons.mozilla.org/en-GB/firefox/addon/aws-console-title-bar/" className="button">Firefox Add-ons</a>
          </div>
        </section>
        <section className="github">
          <h2>GitHub Repository</h2>
          <p>Check out the source code and contribute to the project on GitHub:</p>
          <a href="https://github.com/just-ak/AWS-Console-Title-Bar" className="button">GitHub Repository</a>
        </section>
        <section className="readme">
          <h2>README.md</h2>
          <p>For detailed information, refer to the README.md file:</p>
          <pre>
            {`
# AWS Console Title Bar

Chrome Plugin: [AWS Console Title Bar](https://chrome.google.com/webstore/detail/aws-console-title-bar/jhenfbkjfncfbimbkhakchbdefigenfp?hl=en)

FireFox Plugin [AWS Console Title Bar](https://addons.mozilla.org/en-GB/firefox/addon/aws-console-title-bar/)

The AWS Console Title Bar is a plugin designed to assist users of the AWS Console with SSO who have multiple accounts. It helps them identify the account they are currently logged into by displaying the account name on the menu bar in the console's top right corner.

To allow the plugin to work on each AWS Console URL, follow these steps:

1) Install the plugin.
2) Open the AWS Console.
3) Click on the plugin icon in the browser's toolbar. It will have a green dot on it.
4) From the drop-down menu, select "Allow on all AWS Console URLs" or a similar option. This will ensure that the plugin works consistently across different AWS Console URLs.

## Export / Import of URLs
...
...
## Manifest V3 Migration

For information on migrating to Manifest V3 in Chrome extensions, refer to [https://developer.chrome.com/docs/extensions/migrating/to-service-workers/#move-dom-and-window](https://developer.chrome.com/docs/extensions/migrating/to-service-workers/#move-dom-and-window).
            `}
          </pre>
        </section>
      </main>
      <footer>
        <p>&copy; 2023 AKFDEV.com All rights reserved.</p>
        <p>Version: {packageJson.version}</p>
      </footer>
    </>
  )
}

export default App
