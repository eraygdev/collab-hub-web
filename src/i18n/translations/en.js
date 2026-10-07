// ═══════════════════════════════════════════════════════════
// ENGLISH TRANSLATIONS
// ═══════════════════════════════════════════════════════════

export const en = {
  // ─── HOME ───
  home: {
    hero: {
      eyebrow: "Open source · Community · Collaboration",
      title_1: "Share your ideas,",
      title_2: "build your team.",
      subtitle:
        "Discover open source projects, contribute, or publish your own. All developers in one place.",
    },
    search: {
      placeholder: "Search projects, categories or tech...",
      aria_clear: "Clear search",
      button: "search",
      warning_prefix: "Invalid character:",
      history_label: "Recent Searches",
      history_clear: "clear all",
      history_remove: 'Remove "{{query}}" search',
      no_results: "No results found",
      results_hint: "{{count}} projects found · scroll down",
      no_results_hint: "no results found",
    },
    quick: {
      create: "Create Project",
      dashboard: "Dashboard",
    },
    explore: {
      title: "/explore",
      subtitle: "Latest projects created by the community.",
      view_normal: "Large cards",
      view_compact: "Small cards",
    },
    categories: {
      all: "all",
      more: "+{{count}} more",
    },
    match: {
      label: "match:",
      any: "any",
      all: "all",
    },
    filters: {
      count: "{{count}} projects",
      count_with_categories: "{{count}} projects · {{catCount}} categories",
      clear: "clear filters",
    },
    error: {
      title: "couldn't load projects",
      retry: "try again",
    },
    load_more: "load more",
    load_more_loading: "loading",
    empty: {
      filtered_title: "no results found",
      empty_title: "no projects yet",
      filtered_desc: "No projects match your search or filter criteria.",
      empty_desc: "Be the first to create one!",
      clear_filters: "clear filters",
      create: "create project",
    },
  },

  // ─── NAVBAR ───
  navbar: {
    aria: {
      open_menu: "Open menu",
      close_menu: "Close menu",
      search_users: "Search users",
      logo: "RepoReef home",
    },
    auth: {
      login: "Sign In",
      register: "Sign Up",
    },
    mobile_search: {
      placeholder: "Search users...",
      aria_clear: "Clear",
      warning_prefix: "Invalid character:",
      history_label: "Recent Searches",
      history_clear: "clear all",
      history_remove: 'Remove "{{username}}" search',
      no_results: "No results found",
    },
  },

  // ─── USER SEARCH ───
  user_search: {
    placeholder: "Search users...",
    aria_clear: "Clear",
    history_label: "Recent Searches",
    history_clear: "Clear all",
    history_remove: 'Remove "{{username}}" search',
    no_results: "No results found",
  },

  // ─── USER DROPDOWN ───
  user_dropdown: {
    menu: "User menu",
    profile: "My Profile",
    dashboard: "Dashboard",
    new_project: "Create New Project",
    settings: "Settings",
    logout: "Log Out",
    confirm: {
      title: "Are you sure?",
      desc: "You will be logged out. Do you want to continue?",
      cancel: "Cancel",
      yes: "Yes, Log Out",
    },
  },

  // ─── SIDEBAR ───
  sidebar: {
    title: "Menu",
    aria: {
      menu: "Main menu",
      close: "Close menu",
    },
    home: "Home",
    dashboard: "Dashboard",
    new_project: "New Project",
    profile: "My Profile",
    settings: "Settings",
    login: "Sign In",
    register: "Sign Up",
    brand: "RepoReef · by Reta",
  },

  // ─── FOOTER ───
  footer: {
    cta: {
      welcome_user: "Welcome, {{username}}",
      title: "Share Your Project, Join the Team",
      desc_user: "Create a new project or check your dashboard.",
      desc_guest:
        "Create an account, publish your project, and join the community.",
      create: "Create Project",
      dashboard: "Dashboard",
      github_start: "Start with GitHub",
    },
    brand: {
      tagline:
        "An open source platform where developers share projects, discover, and join teams.",
    },
    section: {
      product: "/product",
      resources: "/resources",
      company: "/company",
    },
    link: {
      explore: "Explore",
      create: "Create Project",
      dashboard: "Dashboard",
      developer: "Developer",
      contact: "Contact",
      twitter: "Twitter",
      about: "About",
      privacy: "Privacy",
      terms: "Terms",
    },
    copyright: "© {{year}} RepoReef · by Reta",
    links: {
      privacy: "privacy",
      terms: "terms",
      cookies: "cookies",
    },
    aria: {
      github: "GitHub Profile",
      email: "Email",
      twitter: "Twitter",
    },
  },

  // ─── LANGUAGE SWITCHER ───
  language_switcher: {
    aria: "Change language",
  },

  // ─── BREADCRUMB ───
  breadcrumb: {
    home: "home",
    dashboard: "dashboard",
    settings: "settings",
    profile_self: "my profile",
    profile_other: "profile:{{username}}",
    project: "project:{{id}}",
    new_project: "new project",
    edit: "edit",
    about: "about us",
    privacy: "privacy",
    terms: "terms",
    cookies: "cookies",
  },

  // ─── DASHBOARD ───
  dashboard: {
    greeting: "Hello, {{username}}",
    subtitle: "Manage your projects, review applications, publish new ideas.",
    view_profile: "My Profile",
    stat: {
      projects: "projects",
      stars: "stars",
      contributors: "contributors",
      pending: "pending",
    },
    new_project: "New Project",
    tab: {
      projects: "/my projects",
      requests: "/incoming requests",
    },
    view_normal: "Large cards",
    view_compact: "Small cards",
    loading: "Loading...",
    error: "Couldn't load projects",
    projects: {
      empty_title: "no projects yet",
      empty_desc: "Start by creating your first project.",
      empty_cta: "create project",
    },
    requests: {
      empty_title: "no pending applications",
      empty_desc: "People who want to join your projects will appear here.",
    },
    request: {
      wants_to_join: "wants to join",
      reject: "reject",
      approve: "approve",
    },
  },

  // ─── PROFILE ───
  profile: {
    loading: "Loading profile...",
    not_found_eyebrow: "profile · not found",
    not_found_title: "user not found",
    not_found_desc: "@{{username}} doesn't exist in the system.",
    back_home: "Back to Home",
    title_self: "My Profile",
    settings: "settings",
    empty_bio: "no bio added yet.",
    stat: {
      projects: "projects",
      stars: "stars",
      contributors: "contributors",
    },
    tab: {
      projects: "/my projects",
      contributions: "/contributed to",
    },
    section: {
      projects_self: "/my projects",
      contributions: "/projects I contributed to",
      projects_other: "/projects",
    },
    empty: {
      projects_self_title: "no projects yet",
      projects_other_title: "no projects yet",
      projects_self_desc: "Start by creating your first project.",
      projects_other_desc: "@{{username}} hasn't shared any projects yet.",
      projects_cta: "create project",
      contributions_title: "you haven't contributed to any project yet",
      contributions_desc:
        "Browse projects from the explore page, join the team.",
      contributions_cta: "explore projects",
    },
    sort: {
      newest: "newest",
      popular: "most popular",
    },
    new_project: "new project",
    view_normal: "Large cards",
    view_compact: "Small cards",
  },

  // ─── SETTINGS ───
  settings: {
    title: "Settings.",
    subtitle: "Manage your account information and preferences.",

    // Sidebar navigasyon
    nav: {
      account: "Account",
      appearance: "Appearance",
      notifications: "Notifications",
      danger: "Danger Zone",
    },

    // Mobil menü butonu
    menu_aria: "Open settings menu",

    // Account sayfası
    account: {
      title: "Account",
      subtitle: "Manage your profile information.",
      section: {
        profile: "/profile information",
      },
      avatar_label: "Profile picture",
      avatar_hint: "Automatically from your GitHub account.",
      username_label: "Username",
      email_label: "Email",
      email_hint: "Comes from your GitHub account, cannot be changed.",
      bio_label: "About",
      bio_placeholder: "Tell us a bit about yourself...",
      submitting: "saving...",
      submit: "save changes",
      success: "Profile updated successfully.",
      error: {
        empty_username: "Username cannot be empty.",
        username_too_long: "Username can be at most {{max}} characters.",
        bio_too_long: "About section can be at most {{max}} characters.",
        username_taken: "This username is already taken.",
        generic: "Something went wrong",
        network: "Couldn't connect to server",
      },
    },

    // Appearance sayfası
    appearance: {
      title: "Appearance",
      subtitle: "Customize how RepoReef looks and feels.",
      language_section: "/language",
      language_label: "Interface language",
      language_hint: "Choose the language for the interface.",
      scale_section: "/text size",
      scale_label: "Text size",
      scale_hint: "Adjust the size of text and spacing across the app.",
      scale_small: "Small",
      scale_medium: "Medium",
      scale_large: "Large",
      theme_section: "/theme",
      theme_label: "Theme",
      theme_hint: "RepoReef currently only supports dark mode.",
      theme_locked: "dark (locked)",
    },

    // Notifications sayfası
    notifications: {
      title: "Notifications",
      subtitle: "Choose what you want to be notified about.",
      coming_soon_title: "coming soon",
      coming_soon_desc: "Notification preferences will be available soon.",
    },

    // Danger sayfası
    danger: {
      title: "Danger Zone",
      subtitle: "Irreversible and destructive actions.",
      section: "/delete account",
      desc: "When you delete your account, all your projects and data are permanently deleted.",
      button: "delete account (coming soon)",
    },
  },

  // ─── AUTH ───
  auth: {
    loading: "Loading...",
    github_oauth_note:
      "RepoReef uses GitHub OAuth for authentication. Passwords are never stored.",
  },

  login: {
    eyebrow: "sign in",
    title: "Welcome back.",
    subtitle: "Sign in to your account and continue where you left off.",
    github_button: "Continue with GitHub",
    no_account: "Don't have an account?",
    register_link: "Sign up",
  },

  register: {
    eyebrow: "sign up",
    title: "Create your account.",
    subtitle: "Join the community, share your project, build your team.",
    github_button: "Sign up with GitHub",
    terms_prefix: "By signing up, you agree to our",
    terms_link: "terms of service",
    and: "and",
    privacy_link: "privacy policy",
    terms_suffix: ".",
    has_account: "Already have an account?",
    login_link: "Sign in",
  },

  callback: {
    loading: "signing in",
  },

  // ─── DETAILS ───
  details: {
    loading: "Loading project...",
    not_found_eyebrow: "project · not found",
    not_found_title: "project not found",
    not_found_desc: "The project you're looking for has been deleted or moved.",
    back_home: "Back to Home",
    edit: "edit",
    deleting: "deleting...",
    delete: "delete",
    delete_confirm:
      "Are you sure you want to delete this project? This action cannot be undone.",
    delete_failed: "Delete failed",
    section: {
      links: "/links",
      contributors: "/contributors ({{count}} / {{max}})",
      about: "/about this project",
      info: "/project info",
      share: "/share",
    },
    meta: {
      stars: "stars",
      contributors: "contributors",
      status: "status",
    },
    cta: {
      your_project: "this project is yours · {{count}} stars",
      starring: "...",
      starred: "starred ({{count}})",
      star: "star ({{count}})",
      leave: "leave project",
      join: "join team",
      owner: "you own this project",
      pending: "your request is pending",
    },
    share: {
      copied: "copied",
      copy: "copy link",
      link: "link",
      twitter: "twitter",
      copy_success: "Link copied!",
      copy_failed: "Couldn't copy link",
    },
  },

  // ─── CREATE / EDIT ───
  create: {
    title: "Create a new project.",
    subtitle: "Introduce your project to the community, find contributors.",
    title_label: "Project Title",
    title_placeholder: "e.g. AI-Powered Code Assistant",
    description_label: "Short Description",
    description_placeholder: "Summarize your project in 1-2 sentences.",
    long_description_label: "Long Description",
    long_description_placeholder:
      "Project details, tech stack, target audience... (optional)",
    github_label: "GitHub URL",
    github_placeholder: "https://github.com/user/project (optional)",
    github_hint: "The repository must be public. Example: github.com/user/repo",
    demo_label: "Demo URL",
    demo_placeholder: "https://project-demo.com (optional)",
    image_label: "Cover Image URL",
    image_placeholder: "https://... (optional)",
    image_hint: "Upload the image to a GitHub repo, then paste the link.",
    image_hint_examples: [
      "github.com/.../.../blob/...?raw=true",
      "github.com/.../blob/...",
      "raw.githubusercontent.com/...",
    ],
    submitting: "saving...",
    submit: "publish project",
    cancel: "cancel",
    limit: {
      title: "Project Limit",
      active: "active",
      full: "full",
      remaining: "You can create {{count}} more projects.",
      reached:
        "You've reached the maximum number of projects. Delete an existing project to create a new one.",
    },
    success: "Project created! Redirecting...",
    error: {
      title_required: "Title and short description are required.",
      too_long: "{{field}} field can be at most {{max}} characters.",
      github_invalid:
        "GitHub URL is invalid. Must start with http:// or https://.",
      demo_invalid: "Demo URL is invalid. Must start with http:// or https://.",
      image_invalid:
        "Image URL is invalid. Must start with http:// or https://.",
      generic: "Something went wrong",
      network: "Couldn't connect to server",
    },
  },

  edit: {
    title: "Edit project.",
    subtitle: "Save your changes or cancel.",
    submitting: "saving...",
    submit: "save changes",
    cancel: "cancel",
    success: "Updated! Redirecting...",
    not_found_eyebrow: "edit · not found",
    not_found_title: "project not found",
    not_found_desc:
      "The project you're trying to edit doesn't exist or you don't have permission.",
    back_home: "Back to Home",
  },

  // ─── LEGAL ───
  legal: {
    updated_at: "last updated: {{date}}",
    footer_disclaimer:
      "this page is for informational purposes · not legal advice",
    breadcrumb_home: "home",
    toc: "/contents",
  },

  about: { title: "About Us" },
  privacy: { title: "Privacy Policy" },
  terms: { title: "Terms of Service" },
  cookies: { title: "Cookie Policy" },

  // ─── NOT FOUND ───
  not_found: {
    eyebrow: "error · 404",
    code: "4 0 4",
    title: "Page not found",
    desc: "The page you're looking for has been deleted, moved, or never existed.",
    back_home: "Back to Home",
    dashboard: "Dashboard",
  },

  // ─── SMALL COMPONENTS ───
  category_picker: {
    title: "Select Categories",
    max_info: "Max {{max}} categories · {{count}} selected",
    loading: "Loading categories...",
    error: "Couldn't load categories. Is the backend running?",
    error_hint: "Make sure the backend is running.",
    empty: "No categories found.",
    cancel: "Cancel",
    confirm: "Confirm ({{count}})",
    close: "Close",
  },

  contributor_limit: {
    label: "Contributor Limit",
    selected: "{{count}} selected",
    locked_hint: "Cannot be changed after creation.",
  },

  category_chips: {
    label: "Categories",
    counter: "{{count}} / {{max}}",
    loading: "Loading categories...",
    more: "+{{count}} more",
    hint: "You can select up to {{max}} categories. (Optional)",
  },

  join_request: {
    title: "Join Team",
    desc: "Submit an application to contribute to this project. When the owner approves, you'll join the team.",
    premium_label: "Why do you want to join?",
    premium_badge: "(Premium)",
    message_placeholder:
      "Briefly tell us about yourself and what you can contribute...",
    message_hint: "Your message will be sent to the project owner. Optional.",
    premium_warning:
      "membership allows you to add a personal message to your application. Standard members submit directly.",
    premium_warning_strong: "Premium",
    cancel: "Cancel",
    submit: "Submit Application",
    submitting: "Submitting...",
  },

  leave_confirm: {
    title: "Are you sure?",
    warning_title: "You're leaving this project.",
    warning_desc: "Your contributor status will end. You can reapply anytime.",
    confirm_desc: "Are you sure you want to continue?",
    cancel: "Cancel",
    submitting: "Leaving...",
    wait: "Wait ({{count}}s)",
    confirm: "Yes, Leave",
  },

  image_preview: {
    error: "Couldn't load image. Check the URL.",
    too_large: "Image is too large (max 2MB). Please use a smaller one.",
  },

  contributor_card: {
    label: "contributor",
  },

  remove_contributor: {
    title: "Remove Contributor",
    aria: "Remove {{username}} from project",
    desc: "Do you want to remove {{username}} from this project?",
    warning_title: "This action cannot be undone.",
    warning_desc:
      "{{username}} will lose contributor status on this project. They can reapply anytime.",
    cancel: "Cancel",
    confirm: "Remove",
    submitting: "Removing...",
  },

  // ─── SCROLL HINT ───
  scroll_hint: {
    label: "scroll to explore",
    aria: "Scroll down to explore",
  },

  scroll_to_top: {
    aria: "Back to top",
  },

  // ─── ERRORS (backend error code → mesaj) ───
  errors: {
    generic: "Something went wrong",
    server_error: "Server error, please try again",

    // auth
    missing_token: "Missing session info",
    invalid_token: "Invalid session",
    invalid_claims: "Invalid session data",
    invalid_user_id: "Invalid user ID",

    // user / profile
    user_not_found: "User not found",
    invalid_data: "Invalid data",
    username_empty: "Username cannot be empty",
    username_required: "Username is required",
    username_taken: "This username is already taken",

    // project
    project_not_found: "project not found",
    invalid_project_id: "Invalid project ID",
    title_and_description_required: "Title and description are required",
    github_url_too_long: "GitHub URL is too long",
    demo_url_too_long: "Demo URL is too long",
    image_url_too_long: "Image URL is too long",
    invalid_github_url: "GitHub URL is invalid",
    github_url_required: "GitHub repository URL is required",
    github_repo_not_accessible:
      "Repository not found or is private. Make sure it's public.",
    invalid_demo_url: "Demo URL is invalid",
    invalid_image_url: "Image URL is invalid",
    image_url_must_be_github:
      "Image URL must be a GitHub link (github.com/.../blob/... or raw.githubusercontent.com/...)",
    image_too_large: "Image is too large (max 2MB)",
    cannot_star_own_project: "You can't star your own project",
    project_limit_reached: "Project limit reached",

    // category
    invalid_category_id: "Invalid category",
    too_many_categories: "Too many categories selected",

    // contributor limit
    invalid_contributor_limit: "Invalid contributor limit",
    contributor_limit_reached: "This project has reached its contributor limit",

    // contributor
    cannot_join_own_project: "You can't join your own project",
    message_too_long: "Message is too long",
    already_pending: "Your application is already pending",
    already_contributor: "You're already a contributor to this project",
    owner_cannot_leave: "Owner cannot leave the project",
    not_a_contributor: "You're not a contributor to this project",
    invalid_request_id: "Invalid request ID",
    request_not_found: "Request not found",

    // permission
    forbidden: "You don't have permission for this action",

    // validation
    username_too_long: "Username is too long",
    username_invalid_char: "Username contains invalid characters",
    bio_too_long: "About section is too long",
    bio_invalid_char: "About section contains invalid characters",
    title_too_long: "Title is too long",
    title_invalid_char: "Title contains invalid characters",
    description_too_long: "Description is too long",
    description_invalid_char: "Description contains invalid characters",
    longDescription_too_long: "Long description is too long",
    longDescription_invalid_char:
      "Long description contains invalid characters",
    search_too_long: "Search text is too long",
    search_invalid_char: "Search text contains invalid characters",

    // min-length
    title_too_short: "Title is too short (min 3 characters)",
    description_too_short: "Description is too short (min 20 characters)",
    username_too_short: "Username is too short (min 3 characters)",

    // generic char warning
    invalid_char:
      'Invalid character: "{{char}}" — you can only use letters, numbers, dot and underscore.',
  },

  // ─── COMMON ───
  common: {
    cancel: "Cancel",
    confirm: "Confirm",
    wait: "Wait ({{count}}s)",
    error_generic: "Something went wrong",
    optional: "(optional)",
    required: "*",
    copied: "Link copied!",
    copy_failed: "Couldn't copy link",
    delete_failed: "Delete failed",
    action_failed: "Action failed",
  },
};
