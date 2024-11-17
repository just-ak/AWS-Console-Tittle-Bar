import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <header>
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
          <section className="cta">
            <h2>Get Started</h2>
            <p>Download the AWS Console Title Bar plugin today and simplify your AWS account management!</p>
            <div className="buttons">
              <a href="https://chrome.google.com/webstore/detail/aws-console-title-bar/jhenfbkjfncfbimbkhakchbdefigenfp?hl=en" className="button">Chrome Web Store</a>
              <a href="https://addons.mozilla.org/en-GB/firefox/addon/aws-console-title-bar/" className="button">Firefox Add-ons</a>
            </div>
          </section>
          <br/>
          <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>

        </main>
      <footer>
        <p>&copy; 2023 AWS Console Title Bar. All rights reserved.</p>
      </footer>
    </>
  )
}

export default App
