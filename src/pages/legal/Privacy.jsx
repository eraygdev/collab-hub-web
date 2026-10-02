import Legal from '../../components/layout/Legal';
import { useLanguage } from '../../i18n/LanguageContext';

export default function Privacy() {
  const { t } = useLanguage();

  const sections = [
    {
      id: 'intro',
      title: 'Introduction',
      content: (
        <>
          <p>
            This privacy policy explains what data is collected when you use
            the Collab-Hub platform, how it is used, and your rights.
          </p>
          <p>
            By using the platform, you are deemed to have accepted this policy.
          </p>
        </>
      ),
    },
    {
      id: 'data-collected',
      title: 'Data Collected',
      content: (
        <>
          <p>When you create an account and use the platform, the following data is collected:</p>
          <ul>
            <li>
              <strong>Identity data:</strong> Username, email address, avatar URL coming
              from GitHub.
            </li>
            <li>
              <strong>Profile data:</strong> Biography, username changes.
            </li>
            <li>
              <strong>Project data:</strong> Projects you publish, title, description,
              links, categories.
            </li>
            <li>
              <strong>Interaction data:</strong> Stars, login records (audit log).
            </li>
            <li>
              <strong>Technical data:</strong> IP address (for audit log), browser info.
            </li>
          </ul>
        </>
      ),
    },
    {
      id: 'purpose',
      title: 'Purpose of Data Use',
      content: (
        <>
          <p>The collected data is used for:</p>
          <ul>
            <li>Creating and managing your account</li>
            <li>Publishing and displaying your projects</li>
            <li>Ensuring platform security</li>
            <li>Detecting and preventing abuse</li>
            <li>Improving the service</li>
          </ul>
        </>
      ),
    },
    {
      id: 'third-parties',
      title: 'Third-Party Services',
      content: (
        <>
          <p>Collab-Hub uses the following third-party services:</p>
          <ul>
            <li>
              <strong>GitHub OAuth:</strong> For authentication. GitHub's privacy
              policy applies.
            </li>
            <li>
              <strong>Neon (PostgreSQL):</strong> Database hosting.
            </li>
            <li>
              <strong>Vercel:</strong> Frontend hosting.
            </li>
          </ul>
        </>
      ),
    },
    {
      id: 'security',
      title: 'Data Security',
      content: (
        <>
          <p>
            Your data is transmitted over encrypted connections. Passwords are
            not stored (GitHub OAuth is used). JWT tokens are valid for 7 days.
          </p>
          <p>
            However, no transmission over the internet is 100% secure. We take
            industry-standard measures to protect your data.
          </p>
        </>
      ),
    },
    {
      id: 'rights',
      title: 'Your Rights',
      content: (
        <>
          <p>Under GDPR and similar laws, you have the following rights:</p>
          <ul>
            <li>Requesting access to your data</li>
            <li>Requesting correction of incorrect data</li>
            <li>Requesting deletion of your account and data</li>
            <li>Objecting to data processing</li>
          </ul>
          <p>
            For your requests, write to{' '}
            <a href="mailto:retadeveloper@gmail.com">
              retadeveloper@gmail.com
            </a>.
          </p>
        </>
      ),
    },
    {
      id: 'changes',
      title: 'Policy Changes',
      content: (
        <p>
          This policy may be updated from time to time. Important changes are
          announced on the platform. The current version is always published on this page.
        </p>
      ),
    },
  ];

  return (
    <Legal
      title={t('privacy.title')}
      updatedAt="September 27, 2026"
      sections={sections}
    />
  );
}