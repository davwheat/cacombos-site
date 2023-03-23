import { SEO } from '@components/SEO';
import Layout from '@components/Design/Layout';
import Section from '@components/Design/Section';
import Hero from '@components/Design/Hero';
import MinorAlert from '@components/Design/MinorAlert';
import Colors from '@data/colors.json';
import Accordion from '@components/Design/Accordion';
import Link from '@components/Links/Link';
import CodeBlock from '@components/CodeBlock';
import SubmitForm from '@components/SubmitPage/SubmitForm';
import OpenInNewIcon from 'mdi-react/OpenInNewIcon';

import type { HeadFC, PageProps } from 'gatsby';

export default function SubmitPage({ location }: PageProps) {
  return (
    <Layout location={location}>
      <Hero color={Colors.primaryRed} firstElement>
        <h1 className="text-shout">Submit combos</h1>
      </Hero>

      <Section>
        <h2 className="text-louder">Getting combos from your device</h2>

        <p className="text-speak">
          There are various ways to get the required carrier combinations from your device. Information for many mobile phones is available below.
        </p>

        <MinorAlert coloredBackground color="cautioningAmber" heading="Warning">
          <p className="text-speak">
            We <strong>cannot</strong> accept screenshots of applications like NetMonster, Cellmapper or NSG to demonstrate combos.
          </p>
        </MinorAlert>

        <div css={{ marginTop: 16 }}>
          <Accordion heading="Qualcomm diag (root)">
            <MinorAlert coloredBackground color="primaryBlue" heading="Requirements" css={{ marginBottom: 16 }}>
              <p className="text-speak">This method should work on any rooted Qualcomm Android device.</p>
            </MinorAlert>

            <ol className="list">
              <li>
                <p className="text-speak">
                  Download and extract <Link href="https://developer.android.com/studio/releases/platform-tools">Android Platform Tools</Link> to your
                  device. On Linux, this might be available through your package manager.
                </p>
              </li>
              <li>
                <p className="text-speak">Connect your phone to your computer via USB, and enable ADB debugging in Developer Options.</p>
              </li>
              <li>
                <p className="text-speak">
                  Launch your terminal (e.g., PowerShell on Windows) and navigate to the directory where you extracted the platform tools.
                </p>
              </li>
              <li>
                <p className="text-speak">
                  Run <code>adb shell</code> in your terminal to launch a remote shell on your Android device
                </p>
              </li>
              <li>
                <p className="text-speak">Run the following commands in your device shell:</p>
                <CodeBlock>
                  {() => `cd /sdcard
mkdir -p /data/vendor/ramdump/diag_logs/
mkdir -p diag_logs
cd diag_logs
curl https://mobilecombos.com/assets/diag.zip > diag.zip
unzip diag.zip`}
                </CodeBlock>
              </li>
              <li>
                <p className="text-speak">
                  Next, use the <code className="code">su</code> command to gain root privileges and then begin logging:
                </p>
                <CodeBlock>
                  {() => `su
diag_mdlog -o /sdcard/diag_logs -f /sdcard/diag_logs/Diag.cfg -m /sdcard/diag_logs/Diag.cfg`}
                </CodeBlock>
              </li>
              <li>
                <p className="text-speak">
                  When logging, turn Airplane Mode on, wait 5 seconds, then turn it back off. Wait 2 mins to reconnect to your network. After this,
                  end the logging session with <kbd>Ctrl + C</kbd>.
                </p>
              </li>
              <li>
                <p className="text-speak">
                  Your log files will be saved in <code className="code">/sdcard/diag_log</code>. Make sure you{' '}
                  <strong>zip and send all files</strong> in this folder. Some newer devices produce different log files and need to be processed
                  differently.
                </p>
              </li>
            </ol>
          </Accordion>

          <Accordion heading="Network Signal Guru premium (root and paid)">
            <MinorAlert coloredBackground color="primaryBlue" heading="Requirements" css={{ marginBottom: 16 }}>
              <p className="text-speak">Requires a paid NSG license and a rooted Android device.</p>
            </MinorAlert>

            <ol className="list">
              <li>
                <p className="text-speak">Open Network Signal Guru.</p>
              </li>
              <li>
                <p className="text-speak">Swipe to the Signalling page.</p>
              </li>
              <li>
                <p className="text-speak">
                  Toggle Airplane Mode on, wait 5 seconds, then turn it off and wait for your device to connect to the network.
                </p>
              </li>
              <li>
                <p className="text-speak">
                  Find a signalling message named "UE Capability Information" (see screenshot below). You may see more than one on a 5G device. If you
                  cannot find it, try toggling airplane mode again.
                </p>
              </li>
              <li>
                <p className="text-speak">
                  Save the log (press <OpenInNewIcon className="icon" /> in the top-right) and upload it to this form.
                </p>
              </li>
            </ol>
          </Accordion>

          <Accordion heading="Network Signal Guru free (root)">
            <MinorAlert coloredBackground color="primaryBlue" heading="Requirements" css={{ marginBottom: 16 }}>
              <p className="text-speak">Requires a rooted Android device. This method does not always work!</p>
            </MinorAlert>

            <ol className="list">
              <li>
                <p className="text-speak">Open Network Signal Guru.</p>
              </li>
              <li>
                <p className="text-speak">
                  Toggle Airplane Mode on, wait 5 seconds, then turn it off and wait for your device to connect to the network.
                </p>
              </li>
              <li>
                <p className="text-speak">Wait approximately 30 seconds, then close NSG.</p>
              </li>
              <li>
                <p className="text-speak">
                  Upload the file <code className="code">/sdcard/NSG/test.log</code> to this form.
                </p>
              </li>
            </ol>
          </Accordion>
        </div>

        <p className="text-speak" css={{ marginTop: 16 }}>
          For more logging methods, please check{' '}
          <Link href="https://cacombos.com/contribute" target="_blank">
            CA Combos' contribution page
          </Link>
          . Most formats supported by CA Combos are also supported by my site.
        </p>
      </Section>
      <Section darker>
        <h2 className="text-louder">Submit combo info for your device</h2>

        <p className="text-speak">
          Use the form below to submit information about your device to our website. If your submission is not complete, your combos may not be
          published.
        </p>

        <SubmitForm />
      </Section>
    </Layout>
  );
}

export const Head: HeadFC = () => <SEO pageName="Contribute"></SEO>;
