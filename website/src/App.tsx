import './App.css'
import AKFDEV_Logo from './assets/AKFDEV_Logo.png'
import packageJson from '../package.json'
import screenshot2 from './docs/screenshot2.png'
import permissionsImg from './docs/permissions.png'
import plugPermission from './docs/plug-permission.png'
import plugPermission2 from './docs/plug-permission2.png'
import groups from './docs/groups.png'
import backupImg from './docs/backup.png'
import featureIcon1 from './assets/feature-icon1.png'
import featureIcon2 from './assets/feature-icon2.png'
import featureIcon3 from './assets/feature-icon3.png'

import compressModeSetting from './docs/compressModeSetting.png'
import compressModeOff from './docs/compressModeOff.png'
import compressModeOn from './docs/compressModeOn.png'

function App() {
  return (
    <>
      <header className="header">
        <div className="container">
          <a href='https://akfdev.com'><img src={AKFDEV_Logo} alt="AKFDEV Logo" className="logo" /></a>
          <h1>AWS Console Title Bar</h1>
          <p>Making life easier for people managing multiple AWS accounts</p>
        </div>
      </header>
      <main className="main">
        <section className="feature-highlights">
          <div className="container">
            <h2>Feature Highlights</h2>
            <div className="feature-grid">
              <div className="feature-card">
                <img src={featureIcon1} alt="Feature 1" />
                <h3>Account Name</h3>
                <p>Displays the account name on the AWS Console menu bar</p>
              </div>
              <div className="feature-card">
                <img src={featureIcon2} alt="Feature 2" />
                <h3>AWS SSO</h3>
                <p>Supports multiple accounts withing Multiple AWS SSO Organisation</p>
              </div>
              <div className="feature-card">
                <img src={featureIcon3} alt="Feature 3" />
                <h3>Firefox, Chrome Plugins</h3>
                <p>Easy to install and configure</p>
              </div>
            </div>
          </div>
        </section>
        <section className="how-it-works">
          <div className="container">
            <h2>How It Works</h2>
            <ol>
              <li>Install the plugin from the Chrome Web Store or Firefox Add-ons</li>
              <li>Open the AWS Console</li>
              <li>Click on the plugin icon in the browser's toolbar</li>
              <li>Select "Allow on all AWS Console URLs"</li>
              <li>Enjoy the convenience of easily identifying your AWS accounts</li>
            </ol>
          </div>
        </section>
        <section className="screenshots">
          <div className="container">
            <h2>Screenshots</h2>
            <img src={screenshot2} alt="Screenshot Hero" className="screenshot"/>
          </div>
        </section>
        <section className="permissions">
          <div className="container">
            <h2>Required Permissions</h2>
            <p>The AWS Console Title Bar plugin requires permissions so that it can:</p>
            <ul>
              <li>Read your users arn on aws.amazon.com sites to determine the account number</li>
            </ul>
            <img src={permissionsImg} alt="Permissions" className="permissions-img"/>
            <h3>Required Permissions</h3>
            <p>Individual URLs will require a quick click...</p>
            <ul>
              <li>Check out the little green dot</li>
            </ul>
            <img src={plugPermission} alt="Permissions" className="permissions-img-small"/><br/>
            <img src={plugPermission2} alt="Permissions" className="permissions-img-medium"/>
          </div>
        </section>
        <section className="compressMode-settings">
          <div className="container">
            <h2>AWS Console Compressed Mode</h2>
            <p>A little setting to remove some of the space around AWS Console data forms.</p>
            <img src={compressModeSetting} alt="Compress Mode Settings" className="backup-img"/>
            <img src={compressModeOff} alt="Compress Mode Off" className="backup-img"/>
            <img src={compressModeOn} alt="Compress Mode On" className="backup-img"/>

          </div>
        </section>
        <section className="backup-settings">
          <div className="container">
            <h2>Backup and Restore Settings</h2>
            <p>You can backup or copy your settings using a JSON file. Follow these steps:</p>
            <ol>
              <li>Go to the plugin settings page.</li>
              <li>Copy the settings JSON and save them as a file.</li>
              <li>To import settings, paste in a new JSON file and click on the "Import" button.</li>
            </ol>
            <img src={backupImg} alt="Backup Settings" className="backup-img"/>
          </div>
        </section>
        <section className="description">
          <div className="container">
            <h2>Product Description</h2>
            <p>The AWS Console Title Bar plugin is designed to help users manage multiple AWS accounts with ease. By displaying the account name prominently on the AWS Console menu bar, users can quickly identify which account they are working in, reducing the risk of errors and improving workflow efficiency. The plugin supports multiple accounts with Single Sign-On (SSO) and is easy to install and configure. Whether you are using Chrome or Firefox, the AWS Console Title Bar plugin is the perfect tool to streamline your AWS account management.</p>
          </div>
        </section>
        <section className="grouped-urls">
          <div className="container">
            <h2>Grouped URLs</h2>
            <p>Manage your URLs by grouping them for better organization <br/>Drag and drop to change the order within each grouped section</p>
            <img src={groups} alt="Grouped URLs" className="grouped-urls-img"/>
          </div>
        </section>
        <section className="cta">
          <div className="container">
            <h2>Get Started</h2>
            <p>Download the AWS Console Title Bar plugin today and simplify your AWS account management!</p>
            <div className="buttons">
              <a href="https://chrome.google.com/webstore/detail/aws-console-title-bar/jhenfbkjfncfbimbkhakchbdefigenfp?hl=en" className="button">Chrome Web Store</a>
              <a href="https://addons.mozilla.org/en-GB/firefox/addon/aws-console-title-bar/" className="button">Firefox Add-ons</a>
            </div>
          </div>
        </section>
        <section className="github">
          <div className="container">
            <h2>GitHub Repository</h2>
            <p>Check out the source code and contribute to the project on GitHub:</p>
            <a href="https://github.com/just-ak/AWS-Console-Tittle-Bar" className="button">GitHub Repository</a>
          </div>
        </section>
        <section className="readme">
          <div className="container">
            <h2>Contributing</h2>
            <p>For detailed information on how to contribute and configure your local environment refer to the README.md file:</p>
          </div>
        </section>
      </main>
      <footer className="footer">
        <div className="container">
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
        </div>
      </footer>
    </>
  )
}

export default App
