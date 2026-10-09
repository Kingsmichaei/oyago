import { CONTACT_EMAIL, PRIVACY_UPDATED } from '../constants'

function Section({ title, children }) {
  return (
    <section className="mt-6">
      <h2 className="font-display text-lg font-bold text-danfo md:text-xl">{title}</h2>
      <div className="mt-2 space-y-2 text-sm leading-relaxed text-chalk/80 md:text-[15px]">{children}</div>
    </section>
  )
}

export default function PrivacyPage({ onBack }) {
  return (
    <div className="overflow-y-auto p-4 md:p-6">
      <article className="answer mx-auto max-w-2xl pb-8">
        <button onClick={onBack} className="text-sm text-danfo underline underline-offset-2">
          ← Back to OyaGo
        </button>
        <h1 className="mt-4 font-display text-2xl font-bold md:text-4xl">Privacy policy</h1>
        <p className="mt-1 text-sm text-chalk/60">Last updated {PRIVACY_UPDATED}</p>

        <p className="mt-4 text-sm leading-relaxed text-chalk/80 md:text-[15px]">
          OyaGo helps you find your way around Lagos by bus. We collect as little about you as we can. This page
          explains, in plain words, what we keep, why, and who else sees it.
        </p>

        <Section title="The short version">
          <ul>
            <li>No sign-up. We never ask for your name, phone number or email.</li>
            <li>
              We only use your location if you tap "Use my location", only to find the nearest bus stop, and we
              don't store it.
            </li>
            <li>No ads, no tracking cookies, no selling your data.</li>
            <li>Your questions and saved places go to our AI provider so it can answer you.</li>
            <li>Routes you share are seen by other users.</li>
          </ul>
        </Section>

        <Section title="What we collect">
          <p>
            <strong>A random ID.</strong> The first time you open OyaGo, we create a random ID and store it in your
            browser (local storage). It links you to your saved places. It is not tied to your name, number or
            device.
          </p>
          <p>
            <strong>Your questions.</strong> When you ask for directions, your question is sent to our server and
            to our AI provider to get an answer. The conversation on your screen clears when you tap "New trip" or
            close the app. Our AI provider may still keep the conversation, as explained below.
          </p>
          <p>
            <strong>Saved places.</strong> When you save a place like Home or Work, we store the label and the
            place you typed under your random ID. When you ask a question, we send them along so "take me go work"
            makes sense. You don't need to give your exact address; a nearby landmark or area is enough.
          </p>
          <p>
            <strong>Your location, only if you ask.</strong> When you tap "Use my location", your phone sends its
            position to our server once. We use it to find the nearest bus stop, then throw it away: we don't save
            it, write it to our logs, or send it to the AI. Only the place name (like "Ikotun") goes with your
            question. If no known bus stop is close, our server asks OpenStreetMap for the area name, sending a
            rounded position (accurate to about 100 metres), not your IP address.
          </p>
          <p>
            <strong>Routes you share.</strong> When you use "Add route", we store the route, fare, tips and the
            name you give (if any). The route is added to OyaGo's route knowledge and can appear in answers to
            other users, along with your name if you gave one.
          </p>
          <p>
            <strong>Technical data.</strong> Like any website, our hosting provider may log basic request details
            such as your IP address, browser type and time of visit. These logs help keep the service running and
            secure.
          </p>
        </Section>

        <Section title="Who we share it with">
          <p>We only share data with the services that make OyaGo work:</p>
          <ul>
            <li>
              <strong>Backboard</strong> stores saved places and conversations, and runs the AI.
            </li>
            <li>
              <strong>OpenRouter</strong> and the model provider (currently Google's Gemma model) process your
              question and saved places to write the answer.
            </li>
            <li>
              <strong>Render</strong> hosts the app and the server.
            </li>
            <li>
              <strong>OpenStreetMap (Nominatim)</strong> turns a rounded position into an area name, only when you
              use "Use my location" and no known bus stop is nearby.
            </li>
            <li>
              <strong>Google Fonts</strong> serves the app's fonts, so Google sees your IP address when they load.
            </li>
          </ul>
          <p>
            Each of these services handles data under its own privacy policy. We do not sell your data or share it
            with advertisers.
          </p>
        </Section>

        <Section title="How long we keep it">
          <ul>
            <li>Saved places stay until you delete them with the ✕ button on the "My places" tab.</li>
            <li>Conversations are kept by our AI provider under its own retention rules.</li>
            <li>Shared routes stay as part of OyaGo's route knowledge unless you ask us to remove them.</li>
          </ul>
          <p>
            If you clear your browser data, you lose your random ID and we can no longer link you to your saved
            places. If you want them deleted too, write to us.
          </p>
        </Section>

        <Section title="Your choices and rights">
          <p>
            Under the Nigeria Data Protection Act 2023, you can ask to see, correct or delete the data we hold
            about you. You can delete saved places yourself at any time. For anything else, such as removing a
            route you shared, email us at{' '}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-danfo underline underline-offset-2">
              {CONTACT_EMAIL}
            </a>
            . Because we don't know who you are, we may ask you for your random ID or details of the route so we
            can find the right data.
          </p>
        </Section>

        <Section title="Please don't share sensitive details">
          <p>
            Don't type passwords, bank details, ID numbers or other people's personal information into OyaGo.
            When you share a route, describe the bus stops and landmarks, not private homes.
          </p>
        </Section>

        <Section title="Children">
          <p>OyaGo is not meant for children under 13, and we do not knowingly collect their data.</p>
        </Section>

        <Section title="Changes">
          <p>
            If we change this policy, we will update it on this page and change the date at the top.
          </p>
        </Section>

        <Section title="Contact">
          <p>
            Questions about privacy? Email{' '}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-danfo underline underline-offset-2">
              {CONTACT_EMAIL}
            </a>
            .
          </p>
        </Section>
      </article>
    </div>
  )
}
