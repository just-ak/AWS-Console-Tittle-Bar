import './App.css'
import AKFDEV_Logo from './assets/AKFDEV_Logo.png'
import packageJson from '../package.json'
import screenshot2 from './docs/screenshot2.png'
import permissionsImg from './docs/permissions.png'
import plugPermission from './docs/plug-permission.png'
import plugPermission2 from './docs/plug-permission2.png'
import groups from './docs/groups.png'
import backupImg from './docs/backup.png'

function App() {
  // const [count, setCount] = useState(0)

  return (
    <>
      <header>
        <a href='https://akfdev.com' ><img src={AKFDEV_Logo} alt="AKFDEV Logo" className="logo" /></a>
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
            <li>Group URLs for better organization</li>
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
        <section className="permissions">
          <h2>Required Permissions</h2>
          <p>The AWS Console Title Bar plugin requires permissions so that it can:</p>
          <ul>
            <li>Read your users arn on aws.amazon.com sites to determine the account number</li>
          </ul>
          <img src={permissionsImg} alt="Permissions" width="50%" />

          <h3>Required Permissions</h3>
          <p>Individual URLs will require a quick click...</p>
          <ul>
            <li>Check out the little green dot</li>
          </ul>
          <img src={plugPermission} alt="Permissions" width="10%" /><br/>
          <img src={plugPermission2} alt="Permissions" width="20%" />
        </section>
        <section className="backup-settings">
          <h2>Backup and Restore Settings</h2>
          <p>You can backup or copy your settings using a JSON file. Follow these steps:</p>
          <ol>
            <li>Go to the plugin settings page.</li>
            <li>Copy the settings JSON and save them as a file.</li>
            <li>To import settings, paste in a new JSON file and click on the "Import" button.</li>
          </ol>
          <img src={backupImg} alt="Backup Settings" width="50%" />
        </section>
        <section className="description">
          <h2>Product Description</h2>
          <p>The AWS Console Title Bar plugin is designed to help users manage multiple AWS accounts with ease. By displaying the account name prominently on the AWS Console menu bar, users can quickly identify which account they are working in, reducing the risk of errors and improving workflow efficiency. The plugin supports multiple accounts with Single Sign-On (SSO) and is easy to install and configure. Whether you are using Chrome or Firefox, the AWS Console Title Bar plugin is the perfect tool to streamline your AWS account management.</p>
        </section>
        <section className="grouped-urls">
          <h2>Grouped URLs</h2>
          <p>Manage your URLs by grouping them for better organization:</p>
          <img src={groups} alt="Permissions" width="20%" /><br/>
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
          <a href="https://github.com/just-ak/AWS-Console-Tittle-Bar" className="button">GitHub Repository</a>
        </section>
        <section className="readme">
          <h2>Contributing</h2>
          <p>For detailed information on how to contribute and configure your local environment refer to the README.md file:</p>
        </section>
      </main>
      <footer>
        <div className="footer-section">
          <h3>Contact Us</h3>
          <p>Company Address: 1234 AKFDEV St, Tech City, TC 56789</p>
          <p>Contact: John Doe - john.doe@akfdev.com</p>
          <p>Support: Jane Smith - jane.smith@akfdev.com</p>
        </div>
        <div className="footer-section">
          <h3>About</h3>
          <p>&copy; 2023 <a href='https://akfdev.com'>AKFDEV</a>. All rights reserved.</p>
          <p>Version: {packageJson.version}</p>
        </div>
        <div className="footer-section">
          <h3>Follow Us</h3>
          <div className="social-links">
            <a href="https://twitter.com/akfdev" target="_blank" rel="noopener noreferrer">Twitter</a>
            <a href="https://linkedin.com/company/akfdev" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <a href="https://github.com/just-ak/AWS-Console-Tittle-Bar" target="_blank" rel="noopener noreferrer">GitHub</a>
          </div>
        </div>
      </footer>
    </>
  )
}

export default App
