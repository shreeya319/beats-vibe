import {
  Mail,
  MapPin,
  MessageCircle,
  MessageSquare,
  Phone,
  Send,
} from "lucide-react"
import { useEffect, useState } from "react"
import { createContactMessage } from "../services/contactService"

const initialForm = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
}

const API_URL = "http://localhost:5000/api/contact-information"

function Contact() {
  const [form, setForm] = useState(initialForm)

  const [contactInfo, setContactInfo] = useState(null)
  const [loadingInfo, setLoadingInfo] = useState(true)
  const [infoError, setInfoError] = useState("")

  const [sending, setSending] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  // ============================================================
  // FETCH CONTACT INFORMATION
  // ============================================================

  useEffect(() => {
    const fetchContactInformation = async () => {
      try {
        setLoadingInfo(true)
        setInfoError("")

        const response = await fetch(API_URL)

        if (!response.ok) {
          throw new Error("Failed to fetch contact information")
        }

        const result = await response.json()

        console.log("Contact Information API:", result)

        /*
          Supports both:

          {
            success: true,
            data: {...}
          }

          and

          {
            success: true,
            data: [{...}]
          }
        */

        let data = result?.data

        if (Array.isArray(data)) {
          data = data[0]
        }

        if (!data) {
          throw new Error("Contact information not found")
        }

        setContactInfo(data)
      } catch (err) {
        console.error(
          "Contact information fetch error:",
          err,
        )

        setInfoError(
          err.message ||
            "Unable to load contact information.",
        )
      } finally {
        setLoadingInfo(false)
      }
    }

    fetchContactInformation()
  }, [])

  // ============================================================
  // HANDLE INPUT CHANGE
  // ============================================================

  const handleChange = (event) => {
    const { name, value } = event.target

    setForm((current) => ({
      ...current,
      [name]: value,
    }))

    setError("")
    setSuccess("")
  }

  // ============================================================
  // SUBMIT CONTACT FORM
  // ============================================================

  const handleSubmit = async (event) => {
    event.preventDefault()

    setSending(true)
    setError("")
    setSuccess("")

    try {
      const result = await createContactMessage({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        subject: form.subject.trim(),
        message: form.message.trim(),
      })

      if (!result.success) {
        throw new Error(
          result.message || "Failed to send message",
        )
      }

      setSuccess(
        "Thank you! Your message has been sent successfully. We will get back to you soon.",
      )

      setForm(initialForm)
    } catch (err) {
      console.error("Contact form error:", err)

      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to send your message. Please try again.",
      )
    } finally {
      setSending(false)
    }
  }

  // ============================================================
  // CONTACT INFORMATION VALUES
  // ============================================================

  const email =
    contactInfo?.email ||
    "support@musicalinstruments.com"

  const phone =
    contactInfo?.phone ||
    "+91 99999 99999"

  const addressLine1 =
    contactInfo?.address_line1 ||
    "Pune, Maharashtra"

  const addressLine2 =
    contactInfo?.address_line2 ||
    "India"

  const supportTitle =
    contactInfo?.support_title ||
    "Customer Support"

  const supportDescription =
    contactInfo?.support_description ||
    "We are happy to assist you with your questions and orders."

  const facebookUrl =
    contactInfo?.facebook_url ||
    "https://www.facebook.com/"

  const instagramUrl =
    contactInfo?.instagram_url ||
    "https://www.instagram.com/"

  const whatsappNumber =
    contactInfo?.whatsapp_number ||
    "+919999999999"

  // ============================================================
  // WHATSAPP URL
  // ============================================================

  const cleanWhatsappNumber =
    whatsappNumber.replace(/\D/g, "")

  const whatsappUrl =
    `https://wa.me/${cleanWhatsappNumber}`

  // ============================================================
  // MAP
  // ============================================================

  /*
    We use address_line1 + address_line2 to generate
    the Google Maps embed URL.

    This avoids the "Map unavailable" problem when
    the database contains only a map location/address.
  */

  const fullAddress =
    `${addressLine1}, ${addressLine2}`

  const mapEmbedUrl =
    `https://www.google.com/maps?q=${encodeURIComponent(
      fullAddress,
    )}&output=embed`

  return (
    <main className="min-h-screen bg-stone-50">

      {/* ========================================================
          HERO
      ======================================================== */}

      <section className="border-b border-stone-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">

          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-600">
            Get In Touch
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight text-stone-950 sm:text-5xl">
            Contact Us
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-7 text-stone-500">
            Have a question about an instrument, your order,
            or our services? We are here to help.
          </p>

        </div>
      </section>


      {/* ========================================================
          CONTACT CONTENT
      ======================================================== */}

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

        <div className="grid gap-8 lg:grid-cols-[380px_1fr]">

          {/* ====================================================
              CONTACT INFORMATION
          ==================================================== */}

          <aside className="rounded-3xl bg-stone-950 p-7 text-white sm:p-8">

            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-400">
              Contact Information
            </p>

            <h2 className="mt-4 text-2xl font-bold">
              We'd love to hear from you.
            </h2>

            <p className="mt-3 text-sm leading-6 text-stone-300">
              Reach out to us for product questions, order
              assistance, or any other enquiries.
            </p>

            {/* Loading */}

            {loadingInfo && (
              <div className="mt-8 rounded-xl bg-white/5 p-4 text-sm text-stone-400">
                Loading contact information...
              </div>
            )}

            {/* Error */}

            {infoError && (
              <div className="mt-8 rounded-xl border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-300">
                {infoError}
              </div>
            )}

            <div className="mt-8 space-y-6">

              {/* ==================================================
                  EMAIL
              ================================================== */}

              <div className="flex gap-4">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-amber-400">
                  <Mail size={20} />
                </div>

                <div>

                  <p className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                    Email
                  </p>

                  <a
                    href={`mailto:${email}`}
                    className="mt-1 block break-all text-sm font-medium text-white transition hover:text-amber-400"
                  >
                    {email}
                  </a>

                </div>

              </div>


              {/* ==================================================
                  PHONE
              ================================================== */}

              <div className="flex gap-4">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-amber-400">
                  <Phone size={20} />
                </div>

                <div>

                  <p className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                    Phone
                  </p>

                  <a
                    href={`tel:${phone}`}
                    className="mt-1 block text-sm font-medium text-white transition hover:text-amber-400"
                  >
                    {phone}
                  </a>

                </div>

              </div>


              {/* ==================================================
                  ADDRESS
              ================================================== */}

              <div className="flex gap-4">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-amber-400">
                  <MapPin size={20} />
                </div>

                <div>

                  <p className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                    Address
                  </p>

                  <p className="mt-1 text-sm leading-6 text-white">
                    {addressLine1}
                    <br />
                    {addressLine2}
                  </p>

                </div>

              </div>


              {/* ==================================================
                  SUPPORT
              ================================================== */}

              <div className="flex gap-4">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-amber-400">
                  <MessageSquare size={20} />
                </div>

                <div>

                  <p className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                    {supportTitle}
                  </p>

                  <p className="mt-1 text-sm leading-6 text-white">
                    {supportDescription}
                  </p>

                </div>

              </div>

            </div>

          </aside>


          {/* ====================================================
              CONTACT FORM
          ==================================================== */}

          <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">

            <div className="mb-7">

              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-600">
                Send a Message
              </p>

              <h2 className="mt-2 text-2xl font-bold text-stone-950">
                How can we help?
              </h2>

              <p className="mt-2 text-sm leading-6 text-stone-500">
                Fill in the form below and our team will
                get back to you.
              </p>

            </div>


            {/* SUCCESS */}

            {success && (
              <div className="mb-6 rounded-xl border border-green-200 bg-green-50 p-4 text-sm font-medium leading-6 text-green-700">
                {success}
              </div>
            )}


            {/* ERROR */}

            {error && (
              <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium leading-6 text-red-700">
                {error}
              </div>
            )}


            {/* FORM */}

            <form
              onSubmit={handleSubmit}
              className="grid gap-5 sm:grid-cols-2"
            >

              {/* NAME */}

              <div>

                <label
                  htmlFor="contact-name"
                  className="mb-2 block text-sm font-semibold text-stone-700"
                >
                  Full Name
                </label>

                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  required
                  className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                />

              </div>


              {/* EMAIL */}

              <div>

                <label
                  htmlFor="contact-email"
                  className="mb-2 block text-sm font-semibold text-stone-700"
                >
                  Email Address
                </label>

                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                  className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                />

              </div>


              {/* PHONE */}

              <div>

                <label
                  htmlFor="contact-phone"
                  className="mb-2 block text-sm font-semibold text-stone-700"
                >
                  Phone Number

                  <span className="ml-1 font-normal text-stone-400">
                    (Optional)
                  </span>

                </label>

                <input
                  id="contact-phone"
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                />

              </div>


              {/* SUBJECT */}

              <div>

                <label
                  htmlFor="contact-subject"
                  className="mb-2 block text-sm font-semibold text-stone-700"
                >
                  Subject
                </label>

                <input
                  id="contact-subject"
                  name="subject"
                  type="text"
                  value={form.subject}
                  onChange={handleChange}
                  placeholder="What is your enquiry about?"
                  required
                  className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                />

              </div>


              {/* MESSAGE */}

              <div className="sm:col-span-2">

                <label
                  htmlFor="contact-message"
                  className="mb-2 block text-sm font-semibold text-stone-700"
                >
                  Message
                </label>

                <textarea
                  id="contact-message"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Write your message..."
                  rows={6}
                  required
                  className="w-full resize-none rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm leading-6 text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                />

              </div>


              {/* SUBMIT */}

              <div className="sm:col-span-2">

                <button
                  type="submit"
                  disabled={sending}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-stone-950 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-amber-500 hover:text-stone-950 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                >

                  {sending ? (
                    "Sending..."
                  ) : (
                    <>
                      Send Message
                      <Send size={18} />
                    </>
                  )}

                </button>

              </div>

            </form>

          </div>

        </div>

      </section>


      {/* ========================================================
          LOCATION & SOCIAL MEDIA
      ======================================================== */}

      <section className="border-t border-stone-200 bg-white">

        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">

          <div className="grid gap-8 lg:grid-cols-2">

            {/* ====================================================
                MAP
            ==================================================== */}

            <div>

              <div className="mb-5">

                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-600">
                  Find Us
                </p>

                <h2 className="mt-2 text-2xl font-bold text-stone-950 sm:text-3xl">
                  Visit Our Location
                </h2>

                <p className="mt-2 text-sm leading-6 text-stone-500">
                  Find us at our store location and get in touch
                  with our team.
                </p>

              </div>


              {/* GOOGLE MAP */}

              <div className="h-[350px] overflow-hidden rounded-3xl border border-stone-200 bg-stone-100 shadow-sm">

                {loadingInfo ? (
                  <div className="flex h-full items-center justify-center text-sm text-stone-500">
                    Loading map...
                  </div>
                ) : (
                  <iframe
                    title="Musical Instruments Store Location"
                    src={mapEmbedUrl}
                    className="h-full w-full border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                )}

              </div>

            </div>


            {/* ====================================================
                SOCIAL MEDIA
            ==================================================== */}

            <div className="rounded-3xl bg-stone-950 p-8 text-white sm:p-10">

              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-400">
                Stay Connected
              </p>

              <h2 className="mt-3 text-2xl font-bold sm:text-3xl">
                Connect With Us
              </h2>

              <p className="mt-4 max-w-md text-sm leading-7 text-stone-300">
                Follow us on social media for new instruments,
                latest collections, updates, offers, and more.
              </p>


              {/* SOCIAL CARDS */}

              <div className="mt-8 grid gap-4 sm:grid-cols-3">

                {/* FACEBOOK */}

                <a
                  href={facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Visit our Facebook page"
                  className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 transition duration-300 hover:-translate-y-1 hover:border-amber-400/50 hover:bg-amber-500 hover:text-stone-950"
                >

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 transition group-hover:bg-black/10">

                    <svg
                      viewBox="0 0 24 24"
                      className="h-5 w-5 fill-current"
                      aria-hidden="true"
                    >
                      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.099 4.388 23.094 10.125 24v-8.437H7.078v-3.584h3.047V9.35c0-3.017 1.792-4.688 4.533-4.688 1.312 0 2.686.236 2.686.236v2.953h-1.514c-1.491 0-1.956.93-1.956 1.886v2.264h3.328l-.532 3.584h-2.796V24C19.612 23.094 24 18.099 24 12.073z" />
                    </svg>

                  </div>

                  <div>

                    <p className="text-sm font-semibold">
                      Facebook
                    </p>

                    <p className="mt-0.5 text-xs text-stone-400 transition group-hover:text-stone-800">
                      Follow us
                    </p>

                  </div>

                </a>


                {/* INSTAGRAM */}

                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Visit our Instagram page"
                  className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 transition duration-300 hover:-translate-y-1 hover:border-amber-400/50 hover:bg-amber-500 hover:text-stone-950"
                >

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 transition group-hover:bg-black/10">

                    <svg
                      viewBox="0 0 24 24"
                      className="h-5 w-5 fill-none stroke-current"
                      strokeWidth="1.8"
                      aria-hidden="true"
                    >
                      <rect
                        x="3"
                        y="3"
                        width="18"
                        height="18"
                        rx="5"
                      />

                      <circle
                        cx="12"
                        cy="12"
                        r="4.2"
                      />

                      <circle
                        cx="17.5"
                        cy="6.5"
                        r="1"
                        className="fill-current stroke-none"
                      />
                    </svg>

                  </div>

                  <div>

                    <p className="text-sm font-semibold">
                      Instagram
                    </p>

                    <p className="mt-0.5 text-xs text-stone-400 transition group-hover:text-stone-800">
                      Follow us
                    </p>

                  </div>

                </a>


                {/* WHATSAPP */}

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Chat with us on WhatsApp"
                  className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 transition duration-300 hover:-translate-y-1 hover:border-amber-400/50 hover:bg-amber-500 hover:text-stone-950"
                >

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 transition group-hover:bg-black/10">

                    <svg
                      viewBox="0 0 24 24"
                      className="h-5 w-5 fill-current"
                      aria-hidden="true"
                    >
                      <path d="M12.04 2C6.52 2 2.03 6.49 2.03 12.01c0 1.77.46 3.5 1.34 5.02L2 22l5.12-1.34a9.96 9.96 0 0 0 4.92 1.29h.01c5.52 0 10-4.49 10-10.01C22.05 6.49 17.56 2 12.04 2Zm0 18.25h-.01a8.25 8.25 0 0 1-4.21-1.16l-.3-.18-3.04.8.81-2.96-.2-.31a8.27 8.27 0 1 1 6.95 3.81Zm4.53-6.19c-.25-.13-1.47-.73-1.7-.81-.23-.08-.4-.13-.57.13-.17.25-.65.81-.8.98-.15.17-.3.19-.55.06-.25-.13-1.05-.39-2-1.24-.74-.66-1.24-1.48-1.38-1.73-.14-.25-.02-.39.11-.52.12-.12.25-.3.38-.45.13-.15.17-.25.25-.42.08-.17.04-.32-.02-.45-.06-.13-.57-1.36-.78-1.86-.21-.5-.42-.43-.57-.44h-.49c-.17 0-.45.06-.68.32-.23.25-.89.87-.89 2.12s.91 2.46 1.04 2.63c.13.17 1.79 2.73 4.34 3.83.61.26 1.09.41 1.61.1.49-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.16-.48-.29Z" />
                    </svg>

                  </div>

                  <div>

                    <p className="text-sm font-semibold">
                      WhatsApp
                    </p>

                    <p className="mt-0.5 text-xs text-stone-400 transition group-hover:text-stone-800">
                      Chat with us
                    </p>

                  </div>

                </a>

              </div>


              {/* ==================================================
                  WHATSAPP QUICK ASSISTANCE
              ================================================== */}

              <div className="mt-8 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-5">

                <div className="flex items-start gap-4">

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-stone-950">
                    <MessageCircle size={21} />
                  </div>

                  <div>

                    <h3 className="font-semibold text-white">
                      Need quick assistance?
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-stone-400">
                      Chat with our team on WhatsApp for quick
                      help with products and orders.
                    </p>

                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex text-sm font-semibold text-amber-400 transition hover:text-amber-300"
                    >
                      Chat on WhatsApp →
                    </a>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

    </main>
  )
}

export default Contact