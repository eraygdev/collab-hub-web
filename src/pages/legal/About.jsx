import Legal from '../../components/layout/Legal';
import { useLanguage } from '../../i18n/LanguageContext';

export default function About() {
  const { t } = useLanguage();

  const sections = [
    {
      id: 'mission',
      title: 'Our Mission',
      content: (
        <>
          <p>
            RepoReef is a platform where developers can share their open source projects,
            discover others, and collaborate together. Our goal is to help ideas come to
            life quickly and connect with the right people.
          </p>
          <p>
            Publish your project, find contributors, build your team. All in one place.
          </p>
        </>
      ),
    },
    {
      id: 'how-it-works',
      title: 'How It Works',
      content: (
        <>
          <p>RepoReef consists of three simple steps:</p>
          <ul>
            <li>
              <strong>Discover:</strong> Filter by categories, search, and star the projects you like.
            </li>
            <li>
              <strong>Publish:</strong> Create your own project, add GitHub and demo links, build your team.
            </li>
            <li>
              <strong>Contribute:</strong> Join projects you're interested in, connect with developers.
            </li>
          </ul>
        </>
      ),
    },
    {
      id: 'open-source',
      title: 'Open Source',
      content: (
        <>
          <p>
            RepoReef is an <strong>open source project platform</strong>.
            The project itself is also developed as open source. We are always open to
            code, suggestions, and feedback.
          </p>
          <p>
            You can contribute via GitHub, report bugs, or suggest new features.
          </p>
        </>
      ),
    },
    {
      id: 'contact',
      title: 'Contact',
      content: (
        <>
          <p>
            Reach out to us for questions, suggestions, or collaboration requests:
          </p>
          <ul>
            <li>
              GitHub:{' '}
              <a
                href="https://github.com/eraygdev"
                target="_blank"
                rel="noopener noreferrer"
              >
                github.com/eraygdev
              </a>
            </li>
            <li>
              Email:{' '}
              <a href="mailto:retadeveloper@gmail.com">
                retadeveloper@gmail.com
              </a>
            </li>
          </ul>
        </>
      ),
    },
  ];

  return (
    <Legal
      title={t('about.title')}
      updatedAt="September 27, 2026"
      sections={sections}
    />
  );
}