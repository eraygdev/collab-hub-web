import Legal from '../../components/layout/Legal';
import { useLanguage } from '../../i18n/LanguageContext';

export default function Terms() {
  const { t } = useLanguage();

  const sections = [
    {
      id: 'acceptance',
      title: 'Acceptance of Terms',
      content: (
        <p>
          By accessing and using RepoReef, you are deemed to have accepted these terms of use.
          If you do not accept the terms, please do not use the platform.
        </p>
      ),
    },
    {
      id: 'account',
      title: 'Account Responsibility',
      content: (
        <>
          <p>Responsibilities regarding your account:</p>
          <ul>
            <li>You are responsible for the accuracy of your account information.</li>
            <li>You are responsible for all transactions made through your account.</li>
            <li>If you notice unauthorized use of your account, you must notify us immediately.</li>
          </ul>
        </>
      ),
    },
    {
      id: 'content-rules',
      title: 'Content Rules',
      content: (
        <>
          <p>The following are prohibited in content you share on the platform:</p>
          <ul>
            <li>Illegal content</li>
            <li>Hate speech, insults, threats</li>
            <li>Copyright infringement</li>
            <li>Spam, ads, misleading content</li>
            <li>Malware or harmful code</li>
            <li>Unauthorized sharing of personal data</li>
          </ul>
          <p>
            Content that violates these rules may be removed without prior notice, and
            your account may be suspended.
          </p>
        </>
      ),
    },
    {
      id: 'ip',
      title: 'Intellectual Property',
      content: (
        <>
          <p>
            The intellectual property rights of the projects you publish belong to you.
            However, by uploading to the platform, you grant us a limited license
            to display your content to other users.
          </p>
          <p>
            The RepoReef name, logo, and design belong to us; they cannot be used
            without permission.
          </p>
        </>
      ),
    },
    {
      id: 'disclaimer',
      title: 'Disclaimer',
      content: (
        <>
          <p>
            RepoReef is provided "as is". No guarantee of uninterrupted or error-free
            operation is given.
          </p>
          <p>
            No responsibility is accepted for the accuracy, security, or legality of
            projects shared on the platform. RepoReef cannot be held responsible for
            issues arising from interactions between users.
          </p>
        </>
      ),
    },
    {
      id: 'account-deletion',
      title: 'Account Suspension and Deletion',
      content: (
        <p>
          Accounts that violate the terms of use may be suspended or deleted without
          prior notice. You can also delete your account yourself at any time.
        </p>
      ),
    },
    {
      id: 'changes',
      title: 'Changes to Terms',
      content: (
        <p>
          These terms may be updated from time to time. Changes take effect as soon as
          they are published on this page. Continuing to use the platform means you
          accept the current terms.
        </p>
      ),
    },
    {
      id: 'law',
      title: 'Governing Law',
      content: (
        <p>
          These terms are subject to the laws of the Republic of Türkiye. In case of
          disputes, Turkish courts have jurisdiction.
        </p>
      ),
    },
  ];

  return (
    <Legal
      title={t('terms.title')}
      updatedAt="September 27, 2026"
      sections={sections}
    />
  );
}