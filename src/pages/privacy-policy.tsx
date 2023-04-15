import { SEO } from '@components/SEO';
import Layout from '@components/Design/Layout';
import Section from '@components/Design/Section';
import Hero from '@components/Design/Hero';
import Link from '@components/Links/Link';
import MinorAlert from '@components/Design/MinorAlert';

import Colors from '@data/colors.json';

import dayjs from 'dayjs';

import type { HeadFC, PageProps } from 'gatsby';

/**
 * HELLO ME IN THE FUTURE!
 *
 * We MUST update this date when we make changes to the privacy policy.
 *
 * This date is reused in other areas of the site to help users identify when
 * our privacy policy was last updated so they can be more easily informed
 * of future changes.
 */
export const privacyPolicyLastUpdated = new Date('2023-04-15 01:00:00Z');

export default function PrivacyPolicyPage({ location }: PageProps) {
  return (
    <Layout location={location}>
      <Hero firstElement>
        <h1 className="text-shout">Privacy policy</h1>
        <p className="text-speak">
          Last updated on <time dateTime={privacyPolicyLastUpdated.toISOString()}>{dayjs(privacyPolicyLastUpdated).format('D MMMM YYYY')}</time>
        </p>
      </Hero>
      <Section>
        <p className="text-speak">
          In today's world, privacy is important. We've written this simple privacy policy to explain what data we collect, how we use it, and what
          rights you have.
        </p>
      </Section>

      <Section>
        <h2 className="text-louder" id="our-info">
          Our info
        </h2>

        <address
          css={{
            background: Colors.lightGrey,
            padding: 24,
            marginBottom: 24,
            '& :last-child': {
              marginBottom: 0,
            },
          }}
        >
          <p className="text-speak">David Wheatley trading as mobilecombos.com</p>
          <p className="text-speak">
            Contact email: <Link href="mailto:david@mobilecombos.com">david@mobilecombos.com</Link>
          </p>
        </address>

        <p className="text-speak">
          We are registered with the UK Information Commissioner's Office as a data controller under registration number ZB528163.
        </p>
      </Section>

      <Section>
        <h2 className="text-louder" id="personal-information-we-collect">
          Personal information we collect
        </h2>

        <h3 className="text-loud">Web traffic and usage information</h3>

        <p className="text-speak">When you use our site, we may collect some of your personal information. This includes:</p>

        <ul className="list">
          <li>IP address used to browse our website and access our API</li>
          <li>browser information (user agent)</li>
          <li>email address (details below)</li>
          <li>device information and metadata (details below)</li>
        </ul>

        <h3 className="text-loud" id="contribution-submissions">
          Contribution submissions
        </h3>

        <p className="text-speak">
          By default, we store all submissions made through our contributions form, which includes any personal information you provide alongside your
          submission.
        </p>

        <ul className="list">
          <li>email address (optional)</li>
          <li>freeform comments of your choice</li>
          <li>device logs (details below)</li>
        </ul>

        <h3 className="text-loud">Device logs</h3>

        <p className="text-speak">
          Device logs contain vast amounts of data about the device in question. Some of this data could be used to wholly personally identify, or to
          assist in doing so alongside other information. Not all devices provide log files containing all of the following information.
        </p>

        <p className="text-speak">Data from device logs may include:</p>

        <ul className="list">
          <li>device geolocation</li>
          <li>
            detailed device information
            <ul className="list">
              <li>device IMEI</li>
              <li>device serial number</li>
              <li>device model</li>
              <li>device firmware version</li>
              <li>
                network information
                <ul className="list">
                  <li>carrier name</li>
                  <li>carrier MCC/MNC</li>
                  <li>MSISDN and IMSI</li>
                  <li>network roaming status</li>
                </ul>
              </li>
              <li>SIM ICCID</li>
            </ul>
          </li>
          <li>
            network activity during the logging process
            <ul className="list">
              <li>SMS details</li>
              <li>incoming or outgoing call traffic</li>
            </ul>
          </li>
        </ul>

        <p className="text-speak">
          Due to the amount of submissions we receive, we cannot provide you with an accurate statement of what personally identifiable information
          your device log contains when you submit it as any personal data is never extracted and stored outside the log file itself.
        </p>
      </Section>

      <Section>
        <h2 className="text-louder" id="how-we-get-your-information">
          How we get your information
        </h2>

        <p className="text-speak">Most personal information we process is provided to us directly by you for one of the following reasons:</p>

        <ul className="list">
          <li>you submit a contribution to our site</li>
          <li>you contact us via email</li>
        </ul>

        <p className="text-speak">
          We also collect personal information about your usage of our website to help us identify errors, improve our site, and identify problematic
          or fraudulent web traffic.
        </p>
      </Section>

      <Section>
        <h2 className="text-louder" id="how-we-use-your-information">
          How we use your information
        </h2>

        <p className="text-speak">
          We use your personal information to provide you with the services you request, to improve our site, and to identify and prevent fraud.
        </p>

        <p className="text-speak">
          Under the UK and EU General Data Protection Regulation (GDPR), the lawful basis we rely on for processing this information is:
        </p>

        <ul className="list">
          <li>we have a legitimate interest</li>
        </ul>

        <p className="text-speak">
          We have a legitimate interest in processing your personal information in order to provide our services (parsing and providing device
          capability information) to you and the public through our website. This does not affect your rights surrounding your personal data under the
          UK and EU GDPR.
        </p>
      </Section>

      <Section>
        <h2 className="text-louder" id="how-we-store-your-information">
          How we store your information
        </h2>

        <p className="text-speak">All personal information you send to us is stored securely electronically.</p>

        <p className="text-speak">
          Website access and error logs containing your browser information and IP address are stored on our Hetzner cloud server in Nuremberg,
          Germany. These log files are rotated daily, and automatically deleted after a maximum of 28 days.
        </p>

        <p className="text-speak">
          Device logs are stored in a secure Backblaze B2 storage bucket in Amsterdam, Netherlands and only downloaded as necessary to deliver our
          services. This data is kept until the log has been parsed and all capability data has been extracted. After this, we delete the log file
          after a maximum of 30 days.
        </p>

        <p className="text-speak">
          All contribution form submissions are forwarded to the website administrator via email. This data is stored on Google mail servers and
          propagated worldwide. We do not store this data on our own servers. These form submissions are kept indefinitely to maintain a record of our
          users' contributions.
        </p>
      </Section>

      <Section>
        <h2 className="text-louder" id="your-data-protection-rights">
          Your data protection rights
        </h2>

        <p className="text-speak">Under the UK and EU GDPR, you have the following rights regarding your personal data:</p>

        <ul className="list">
          <li>
            right to be informed &mdash; you have the right to be informed about how we use your personal data (detailed in this privacy policy)
          </li>
          <li>right of access &mdash; you can request copies of any data we have on you</li>
          <li>right to rectification &mdash; you can request that we correct any data we have on you that you believe is inaccurate or incomplete</li>
          <li>right to erasure &mdash; you can request that we erase any data we have on you in certain circumstances</li>
          <li>right to restrict processing &mdash; you can request that we restrict the processing of your data in certain circumstances</li>
          <li>
            right to data portability &mdash; you can request that we transfer the data we have on you to another organisation in certain
            circumstances
          </li>
          <li>right to object &mdash; you can object to the processing of your data in certain circumstances</li>
        </ul>

        <p className="text-speak">
          Making a request to exercise any of these rights does not carry any charge, and we aim to reply within one calendar month. If we require
          additional time, we will inform you of this and the reason why.
        </p>

        <p className="text-speak">
          If you wish to make a request to exercise any of these rights, please contact us at{' '}
          <a href="mailto:david@mobilecombos.com">david@mobilecombos.com</a>.
        </p>

        <p className="text-speak">
          If we determine that your request is vexatious, or you have submitted a number of requests in a short period of time, we may charge you an
          administration fee to cover our costs in responding to your request. We will inform you of this before processing your request.
        </p>

        <p className="text-speak">
          In order to make a request to exercise any of these rights, we must be satisfied that you are the person to whom the personal data relates.
          In order to fulfil this obligation, you must send any requests to exercise these rights to us via the email address the personal data in
          question was submitted from.
        </p>

        <MinorAlert color="excessiveYellow" coloredBackground heading="Information regarding right of access" css={{ margin: '16px 0' }}>
          <p className="text-speak">
            We do not associate device log information or capability information with any particular person after it has been extracted from a form
            submission.{' '}
            <strong>
              This means we cannot link a device log to the original submittor after it has been processed, hence you cannot request this information
              under GDPR.
            </strong>
          </p>
          <p className="text-speak">
            A subject access request will entitle you to any contribution form submissions we have not yet processed fully, or still have a record of.
            To do this, you must send a request to us via the email the contribution was submitted from.
          </p>
        </MinorAlert>
      </Section>

      <Section>
        <h2 className="text-louder" id="how-to-complain">
          How to complain
        </h2>

        <p className="text-speak">
          If you have any concerns about our use of your personal data, you can make a complaint to us at{' '}
          <a href="mailto:data-protection@mobilecombos.com">data-protection@mobilecombos.com</a>
        </p>

        <p className="text-speak">
          If you are not satisfied with our response and are unhappy with how we have used your data, you can make a complaint to the UK Information
          Commissioner's Office (ICO).
        </p>

        <address
          css={{
            background: Colors.lightGrey,
            padding: 24,
            marginBottom: 24,
            '& :last-child': {
              marginBottom: 0,
            },
          }}
        >
          <div css={{ marginBottom: 16, '& p': { margin: 0 } }}>
            <p className="text-speak">
              <strong>Information Commissioner's Office</strong>
            </p>
            <p className="text-speak">Wycliffe House</p>
            <p className="text-speak">Water Lane</p>
            <p className="text-speak">Wilmslow</p>
            <p className="text-speak">Cheshire</p>
            <p className="text-speak">SK9 5AF</p>
          </div>

          <p className="text-speak">
            Helpline number: <a href="tel:0303 123 1113">0303 123 1113</a>
          </p>
          <p className="text-speak">
            Website: <a href="https://ico.org.uk">https://ico.org.uk</a>
          </p>
        </address>
      </Section>

      <Section>
        <h2 className="text-louder" id="changes-to-our-privacy-policy">
          Changes to our privacy policy
        </h2>

        <p className="text-speak">
          We may change this privacy policy from time to time. The latest version of this policy will always be available on this page. We advise that
          you check the policy regularly and before submitting any personal information to us to ensure you are always aware of the latest version.
        </p>
      </Section>
    </Layout>
  );
}

export const Head: HeadFC = () => <SEO pageName="Privacy policy" />;
