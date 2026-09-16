// Content for /privacy-policy and /terms-and-conditions, rendered by LegalPage.
//
// Written to describe what this website actually does — the forms and chat
// assistant post to /api/contact (reCAPTCHA check, then email via SMTP2GO),
// GA4 / Google Ads / Microsoft Clarity load only on the live domain
// (src/lib/analytics.js, src/lib/clarity.js), and accessibility preferences
// stay in the visitor's own browser (AccessibilityWidget). If any of those
// integrations change, update the matching section here.
//
// Each section: { heading, paragraphs?: string[], list?: string[] }.
// Plain strings only; links are rendered by LegalPage from `links`.
import { BUSINESS, FULL_ADDRESS } from './business.js'
import { PHONE_DISPLAY, SERVICE_AREAS } from './nav.js'

export const LEGAL_LAST_UPDATED = 'September 16, 2026'

const CONTACT = [
  BUSINESS.name,
  FULL_ADDRESS,
  `Phone: ${PHONE_DISPLAY}`,
  `Email: ${BUSINESS.email}`,
]

export const PRIVACY_POLICY = {
  path: '/privacy-policy',
  title: 'Privacy Policy',
  metaTitle: 'Privacy Policy | Preventive Home Solutions',
  metaDescription:
    'How Preventive Home Solutions collects, uses, and protects the information you share through our website, forms, calls, and text messages.',
  intro:
    `This Privacy Policy explains how ${BUSINESS.name} (“we,” “us,” or “our”) collects, uses, and shares information when you visit preventivehomesolutions.com, request service, or contact us.`,
  sections: [
    {
      heading: 'Information You Give Us',
      paragraphs: [
        'When you request a quote, claim a coupon, use our chat assistant, call, or email us, we collect the information you choose to provide. Depending on the form, this can include:',
      ],
      list: [
        'Your first and last name',
        'Your phone number and email address',
        'Your ZIP code or city',
        'The service you need and any details you add about your request',
        'Whether you agreed to receive text messages about your request',
      ],
    },
    {
      heading: 'Information Collected Automatically',
      paragraphs: [
        'Like most websites, ours uses a few third-party tools that collect technical information when you browse:',
      ],
      list: [
        'Google Analytics, which measures pages visited, time on site, device and browser type, approximate location, how you arrived at our site, and actions such as clicking to call or submitting a form.',
        'Google Ads conversion tracking, which tells us when a visit from one of our ads leads to a call or service request.',
        'Microsoft Clarity, which records how visitors interact with our pages (such as clicks, scrolling, and mouse movement) so we can find and fix problems with the site.',
        'Google reCAPTCHA, which checks form submissions for spam and abuse and collects device and interaction information to do so. Its use is subject to Google’s Privacy Policy and Terms of Service.',
      ],
    },
    {
      heading: 'Cookies and Browser Storage',
      paragraphs: [
        'Google Analytics, Google Ads, Microsoft Clarity, and reCAPTCHA may set cookies or similar technologies in your browser. You can block or delete cookies in your browser settings, and you can opt out of Google Analytics with Google’s browser add-on.',
        'If you use the accessibility toolbar on our site, your display preferences are saved in your own browser so they stay in place as you move between pages. That setting is not sent to us.',
      ],
    },
    {
      heading: 'How We Use Your Information',
      list: [
        'To respond to your request, provide estimates, and schedule and perform service',
        'To send a confirmation email when you submit a request with your email address',
        'To call, email, or text you about your request',
        'To honor coupons and discounts you claim',
        'To understand how our website and advertising perform and to improve them',
        'To protect our website and forms from spam, fraud, and abuse',
        'To keep business records and meet legal obligations',
      ],
    },
    {
      heading: 'Text Messages',
      paragraphs: [
        'If you check the consent box on one of our forms, you agree to receive text messages from Preventive Home Solutions about your request. Message frequency varies with your request. Message and data rates may apply. You can stop text messages at any time by replying STOP or by contacting us.',
        'Mobile information will not be shared with third parties or affiliates for marketing or promotional purposes. Text messaging opt-in data and consent will not be shared with any third parties.',
      ],
    },
    {
      heading: 'How We Share Information',
      paragraphs: [
        'We do not sell your personal information. We share information only as needed to run our business and this website:',
      ],
      list: [
        'With service providers that help us operate, such as our website hosting provider (Vercel), our email delivery provider (SMTP2GO), Google, and Microsoft, as described above',
        'When required by law, or to protect our rights, customers, or the public',
        'As part of a sale, merger, or transfer of all or part of our business',
      ],
    },
    {
      heading: 'How Long We Keep Information',
      paragraphs: [
        'We keep your information only as long as we need it to respond to your request, provide service, maintain business records, and meet our legal obligations.',
      ],
    },
    {
      heading: 'How We Protect Information',
      paragraphs: [
        'Our website is served over a secure, encrypted (HTTPS) connection, and we use reasonable measures to protect the information you share with us. No method of transmitting or storing data is completely secure, so we cannot guarantee absolute security.',
      ],
    },
    {
      heading: 'Your Choices',
      paragraphs: [
        'You can contact us at any time to ask what information we have about you, or to request that we correct or delete it, subject to records we must keep by law. You can also choose not to provide information, though we may then be unable to respond to your request.',
      ],
    },
    {
      heading: 'Children’s Privacy',
      paragraphs: [
        'Our website and services are intended for adults. We do not knowingly collect personal information from children under 13.',
      ],
    },
    {
      heading: 'Links to Other Websites',
      paragraphs: [
        'Our site links to other websites, such as Google Maps and Facebook. Their privacy practices are governed by their own policies, not this one.',
      ],
    },
    {
      heading: 'Changes to This Policy',
      paragraphs: [
        'We may update this Privacy Policy from time to time. The date at the top of this page shows when it was last updated.',
      ],
    },
    {
      heading: 'Contact Us',
      paragraphs: ['If you have questions about this Privacy Policy or your information, contact us:'],
      list: CONTACT,
    },
  ],
  links: [
    { label: 'Google Privacy Policy', href: 'https://policies.google.com/privacy' },
    { label: 'Google Terms of Service', href: 'https://policies.google.com/terms' },
    { label: 'Google Analytics opt-out add-on', href: 'https://tools.google.com/dlpage/gaoptout' },
    { label: 'Microsoft Privacy Statement', href: 'https://privacy.microsoft.com/privacystatement' },
  ],
}

export const TERMS = {
  path: '/terms-and-conditions',
  title: 'Terms & Conditions',
  metaTitle: 'Terms & Conditions | Preventive Home Solutions',
  metaDescription:
    'The terms that apply when you use the Preventive Home Solutions website, request plumbing, heating, or AC service, or claim an online coupon.',
  intro:
    `These Terms & Conditions apply to your use of preventivehomesolutions.com, operated by ${BUSINESS.name}. By using this website, you agree to these terms.`,
  sections: [
    {
      heading: 'Our Services and Service Area',
      paragraphs: [
        `We provide residential plumbing, heating, and air conditioning services in Northern Utah, based in Layton. Our service area includes ${SERVICE_AREAS.slice(0, -1).join(', ')}, and ${SERVICE_AREAS.at(-1)}. We may decline or refer requests outside our service area.`,
      ],
    },
    {
      heading: 'Service Requests and Scheduling',
      paragraphs: [
        'Submitting a form or chat request asks us to contact you. It is not a confirmed appointment until we confirm a time with you directly.',
      ],
    },
    {
      heading: 'Estimates, Pricing, and Warranties',
      paragraphs: [
        'Pricing and service information on this website is general. The price, scope, and terms of any job are set in the estimate or agreement we provide for that job. Any warranty on our work is provided in writing and is governed by its own terms.',
      ],
    },
    {
      heading: 'Coupons and Discounts',
      paragraphs: [
        'Offers shown on our website are subject to the details listed with each offer. Mention the coupon when you call or submit a request. Unless an offer says otherwise, it is limited to one coupon per household and cannot be combined with other offers or discounts. We may change or end an offer at any time.',
      ],
    },
    {
      heading: 'Emergencies',
      paragraphs: [
        'If you smell gas, see sparking, or believe anyone is in immediate danger, leave the home and call 911 or your gas utility right away. Do not wait for a response to a website form.',
      ],
    },
    {
      heading: 'Informational Content',
      paragraphs: [
        'Blog articles, tips, and other content on this website are for general information only and are not a substitute for an on-site inspection by a qualified professional. Any repair or maintenance you choose to do yourself is at your own risk.',
      ],
    },
    {
      heading: 'Text Messages',
      paragraphs: [
        'If you agree to receive text messages on one of our forms, we may text you about your request. Message frequency varies. Message and data rates may apply. Reply STOP to opt out at any time. See our Privacy Policy for how we handle your information.',
      ],
    },
    {
      heading: 'Acceptable Use',
      paragraphs: [
        'Please use this website only for lawful purposes. Do not submit false information, attempt to disrupt or gain unauthorized access to the site, or use automated tools to send requests.',
      ],
    },
    {
      heading: 'Intellectual Property',
      paragraphs: [
        'The content on this website, including text, photos, graphics, and logos, belongs to Preventive Home Solutions or is used with permission. You may not copy or reuse it for commercial purposes without our written permission.',
      ],
    },
    {
      heading: 'Third-Party Links',
      paragraphs: [
        'This website links to third-party sites and services, such as Google Maps and Facebook. We are not responsible for their content or practices.',
      ],
    },
    {
      heading: 'Website Disclaimer and Limitation of Liability',
      paragraphs: [
        'This website is provided “as is.” We work to keep it accurate and available, but we do not guarantee that it will always be error-free or uninterrupted. To the extent permitted by law, Preventive Home Solutions is not liable for damages arising from your use of this website. This section does not limit any rights you have under a written service agreement or warranty, or under applicable law.',
      ],
    },
    {
      heading: 'Governing Law',
      paragraphs: ['These terms are governed by the laws of the State of Utah.'],
    },
    {
      heading: 'Changes to These Terms',
      paragraphs: [
        'We may update these Terms & Conditions from time to time. The date at the top of this page shows when they were last updated.',
      ],
    },
    {
      heading: 'Contact Us',
      paragraphs: ['Questions about these terms? Contact us:'],
      list: CONTACT,
    },
  ],
  links: [{ label: 'Privacy Policy', href: '/privacy-policy' }],
}

export const LEGAL_PAGES = {
  '/privacy-policy': PRIVACY_POLICY,
  '/terms-and-conditions': TERMS,
}
