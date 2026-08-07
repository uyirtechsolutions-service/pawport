'use client'

import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaw, faHeart, faArrowLeft, faArrowRight, faPaperPlane, faCheckCircle } from '@fortawesome/free-solid-svg-icons'
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons'
import dayjs from 'dayjs'
import LocationAutocomplete from './LocationAutocomplete'

const PET_TYPES = ['🐕 Dog', '🐱 Cat', 'Other']
const TIME_SLOTS = ['Early Morning (6 – 9 AM)', 'Morning (9 AM – 12 PM)', 'Afternoon (12 – 4 PM)', 'Evening (4 – 8 PM)', 'Flexible — anytime']
const TRANSPORT_MODES = ['🚐 Ground Transport', '✈️ Flight Escort', '📦 Flight Cargo', '🌍 International', '🚕 Pet Taxi', 'Not sure']

const STEPS = [
  { title: 'Pet Info', icon: faHeart },
  { title: 'Trip', icon: faArrowRight },
  { title: 'Contact', icon: faPaperPlane },
]

function BookingForm() {
  const [step, setStep] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [submitStage, setSubmitStage] = useState(0) // 0=idle, 1=sending, 2=done
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [toast, setToast] = useState(null)

  const showToast = (message, type = 'error') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3500)
  }

  const [form, setForm] = useState({
    petType: '', petName: '', petBreed: '', petAge: '', petWeight: '', petDetails: '',
    pickupPlace: '', dropoffPlace: '', bookingDate: '', preferredTime: '', transportMode: '',
    buyerName: '', buyerWhatsapp: '+91',
  })

  const update = (field, value) => setForm(f => ({ ...f, [field]: value }))

  const validateStep = () => {
    if (step === 0) {
      if (!form.petType) return 'Please select pet type'
      return null
    }
    if (step === 1) {
      if (!form.pickupPlace) return 'Please enter pickup location'
      if (!form.dropoffPlace) return 'Please enter dropoff location'
      if (!form.bookingDate) return 'Please select a date'
      if (!form.preferredTime) return 'Please select preferred time'
      if (!form.transportMode) return 'Please select transport mode'
      return null
    }
    if (step === 2) {
      if (!form.buyerName) return 'Please enter your name'
      if (!form.buyerWhatsapp) return 'Please enter WhatsApp number'
      if (!/^\+91\d{10}$/.test(form.buyerWhatsapp)) return 'Please enter a valid 10-digit mobile number'
      return null
    }
    return null
  }

  const nextStep = () => {
    const err = validateStep()
    if (err) { showToast(err); return }
    if (step < 2) {
      setStep(step + 1)
      window.scrollTo(0, 0)
    }
  }

  const prevStep = () => { if (step > 0) setStep(step - 1) }

  const handleSubmit = async () => {
    const err = validateStep()
    if (err) { showToast(err); return }

    setSubmitting(true)
    setSubmitStage(1) // sending

    try {
      const payload = {
        buyerName: form.buyerName,
        buyerWhatsapp: form.buyerWhatsapp,
        petName: form.petName,
        petType: form.petType,
        petBreed: form.petBreed,
        petAge: form.petAge,
        petWeight: form.petWeight,
        petDetails: form.petDetails,
        pickupPlace: form.pickupPlace,
        dropoffPlace: form.dropoffPlace,
        bookingDate: form.bookingDate,
        preferredTime: form.preferredTime,
        transportMode: form.transportMode,
      }

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.message || 'Failed to submit booking')

      setSubmitStage(2) // done
      await new Promise(r => setTimeout(r, 800))

      setShowConfirmation(true)
      setForm({
        petType: '', petName: '', petBreed: '', petAge: '', petWeight: '', petDetails: '',
        pickupPlace: '', dropoffPlace: '', bookingDate: '', preferredTime: '', transportMode: '',
        buyerName: '', buyerWhatsapp: '+91',
      })
      setStep(0)
    } catch (err) {
      console.error('Submit failed:', err)
      showToast(err.message || 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
      setSubmitStage(0)
    }
  }

  const InputClass = "w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-black placeholder-gray-400 focus:border-pawport-orange focus:outline-none transition-colors text-sm font-body"
  const LabelClass = "block text-xs font-bold uppercase tracking-wider text-black mb-1.5 font-body"
  const SelectClass = "w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-black focus:border-pawport-orange focus:outline-none transition-colors text-sm font-body appearance-none cursor-pointer"

  // Processing overlay
  const STAGES = [
    null,
    { emoji: '📲', label: 'Sending via WhatsApp…', sub: 'Please wait a moment' },
    { emoji: '✅', label: 'Booking confirmed!',     sub: 'Check your WhatsApp shortly' },
  ]
  const stage = STAGES[submitStage]

  if (submitting && stage) {
    return (
      <section className="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center px-6">
        <div className="text-center space-y-6 max-w-xs w-full">
          <div className="text-6xl animate-bounce">{stage.emoji}</div>

          <div className="flex justify-center gap-2">
            {[1, 2].map(i => (
              <div
                key={i}
                className={`h-2 rounded-full transition-all duration-500 ${
                  submitStage >= i ? 'w-8 bg-pawport-orange' : 'w-2 bg-gray-200'
                }`}
              />
            ))}
          </div>

          <div>
            <p className="text-lg font-extrabold font-space text-black">{stage.label}</p>
            <p className="text-sm text-pawport-muted mt-1">{stage.sub}</p>
          </div>

          {submitStage < 2 && (
            <div className="flex justify-center">
              <div className="w-8 h-8 border-4 border-pawport-orange border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          <p className="text-xs text-gray-400">Please don't close this page</p>
        </div>
      </section>
    )
  }

  if (showConfirmation) {
    return (
      <section className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 bg-white">
        <div className="text-center max-w-md space-y-6 py-10">
          <FontAwesomeIcon icon={faCheckCircle} className="text-6xl text-pawport-orange" />
          <div>
            <h2 className="text-2xl font-extrabold font-space text-black mb-2">Booking Sent! 🎉</h2>
            <p className="text-sm text-pawport-muted">Your booking details have been sent. You'll receive a WhatsApp confirmation shortly.</p>
          </div>
          <button
            onClick={() => setShowConfirmation(false)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-pawport-orange hover:bg-pawport-orange-dark text-black font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all"
          >
            <FontAwesomeIcon icon={faPaw} className="w-3.5 h-3.5" /> Book Another Pet
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className="py-4 px-4 md:py-0 md:px-0 bg-white md:h-[calc(100vh-80px)] md:overflow-hidden">
      {/* Toast */}
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[9999] animate-bounce">
          <div className={`flex items-center gap-2 px-5 py-3 rounded-xl shadow-lg text-sm font-bold ${
            toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-pawport-orange text-black'
          }`}>
            <span>{toast.type === 'success' ? '✓' : '⚠'}</span>
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      <div className="max-w-lg md:max-w-3xl mx-auto w-full md:h-full md:py-4 md:px-6 md:flex md:flex-col">
        {/* Header */}
        <div className="text-center mb-6 md:mb-2 md:shrink-0">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-pawport-orange/20 text-pawport-orange rounded-full text-[11px] font-bold uppercase tracking-widest mb-2">
            <FontAwesomeIcon icon={faHeart} className="w-3 h-3" /> Book Now
          </span>
          <h2 className="text-2xl font-extrabold tracking-tight font-space text-black mb-1">
            Ready to move your best friend?
          </h2>
          <p className="text-sm text-pawport-muted">3 simple steps. We'll send your booking via WhatsApp.</p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2 mb-6 md:mb-2 md:shrink-0">
          {STEPS.map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                i <= step ? 'bg-pawport-orange text-black' : 'bg-gray-100 text-gray-400'
              }`}>
                <FontAwesomeIcon icon={s.icon} className="w-3 h-3" />
                <span className="hidden sm:inline">{s.title}</span>
              </div>
              {i < 2 && <div className={`w-4 h-0.5 rounded ${i < step ? 'bg-pawport-orange' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="space-y-4 md:flex-1 md:overflow-y-auto md:min-h-0">

          {/* STEP 0: Pet Info */}
          {step === 0 && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="petType" className={LabelClass}>Pet Type *</label>
                  <select id="petType" value={form.petType} onChange={e => update('petType', e.target.value)} className={SelectClass}>
                    <option value="" disabled>Select type</option>
                    {PET_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="petName" className={LabelClass}>Pet Name</label>
                  <input id="petName" type="text" value={form.petName} onChange={e => update('petName', e.target.value)} placeholder="e.g. Bruno" className={InputClass} />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label htmlFor="petBreed" className={LabelClass}>Breed</label>
                  <input id="petBreed" type="text" value={form.petBreed} onChange={e => update('petBreed', e.target.value)} placeholder="Labrador" className={InputClass} />
                </div>
                <div>
                  <label htmlFor="petAge" className={LabelClass}>Age</label>
                  <input id="petAge" type="text" value={form.petAge} onChange={e => update('petAge', e.target.value)} placeholder="2 years" className={InputClass} />
                </div>
                <div>
                  <label htmlFor="petWeight" className={LabelClass}>Weight</label>
                  <input id="petWeight" type="text" value={form.petWeight} onChange={e => update('petWeight', e.target.value)} placeholder="15 kg" className={InputClass} />
                </div>
              </div>
              <div>
                <label htmlFor="petDetails" className={LabelClass}>Pet Details</label>
                <textarea id="petDetails" value={form.petDetails} onChange={e => update('petDetails', e.target.value)} placeholder="Temperament, medical needs, special instructions…" className={`${InputClass} resize-none h-24`} />
              </div>
            </div>
          )}

          {/* STEP 1: Trip */}
          {step === 1 && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <LocationAutocomplete
                  value={form.pickupPlace}
                  onChange={(val) => update('pickupPlace', val)}
                  label="From (Pickup)"
                  placeholder="Search city, pincode, or address..."
                  required
                />
                <LocationAutocomplete
                  value={form.dropoffPlace}
                  onChange={(val) => update('dropoffPlace', val)}
                  label="To (Dropoff)"
                  placeholder="Search city, pincode, or address..."
                  required
                />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label htmlFor="bookingDate" className={LabelClass}>Date *</label>
                  <input id="bookingDate" type="date" value={form.bookingDate} onChange={e => update('bookingDate', e.target.value)} min={dayjs().format('YYYY-MM-DD')} className={InputClass} />
                </div>
                <div>
                  <label htmlFor="preferredTime" className={LabelClass}>Preferred Time *</label>
                  <select id="preferredTime" value={form.preferredTime} onChange={e => update('preferredTime', e.target.value)} className={SelectClass}>
                    <option value="" disabled>Select time</option>
                    {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label htmlFor="transportMode" className={LabelClass}>Transport Mode *</label>
                  <select id="transportMode" value={form.transportMode} onChange={e => update('transportMode', e.target.value)} className={SelectClass}>
                    <option value="" disabled>Select mode</option>
                    {TRANSPORT_MODES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Contact */}
          {step === 2 && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="buyerName" className={LabelClass}>Your Name *</label>
                  <input id="buyerName" type="text" value={form.buyerName} onChange={e => update('buyerName', e.target.value)} placeholder="Your full name" className={InputClass} />
                </div>
                <div>
                  <label htmlFor="buyerWhatsapp" className={LabelClass}>WhatsApp Number *</label>
                  <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden focus-within:border-pawport-orange transition-colors bg-white">
                    <span className="px-3 py-3 bg-gray-50 text-black font-bold text-sm border-r-2 border-gray-200 select-none">+91</span>
                    <input
                      id="buyerWhatsapp"
                      type="tel"
                      value={form.buyerWhatsapp.replace(/^\+91/, '')}
                      onChange={e => {
                        const digits = e.target.value.replace(/\D/g, '').slice(0, 10)
                        update('buyerWhatsapp', '+91' + digits)
                      }}
                      placeholder="98765 43210"
                      maxLength={10}
                      className="flex-1 px-3 py-3 text-black placeholder-gray-400 focus:outline-none text-sm font-body bg-white"
                    />
                  </div>
                </div>
              </div>
              <div className="bg-pawport-orange/5 border border-pawport-orange/15 rounded-xl p-4">
                <p className="text-xs text-pawport-muted leading-relaxed">
                  <FontAwesomeIcon icon={faPaw} className="text-pawport-orange mr-1" />
                  Your booking details will be sent to the transporter via WhatsApp. You'll receive a confirmation shortly.
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-4 md:mt-2 md:shrink-0">
          {step > 0 ? (
            <button onClick={prevStep} className="inline-flex items-center gap-2 px-5 py-3 border-2 border-black rounded-xl text-black font-bold text-xs uppercase tracking-wider hover:bg-black hover:text-white transition-all">
              <FontAwesomeIcon icon={faArrowLeft} className="w-3 h-3" /> Back
            </button>
          ) : (
            <div />
          )}

          {step < 2 ? (
            <button onClick={nextStep} className="inline-flex items-center gap-2 px-6 py-3 bg-pawport-orange hover:bg-pawport-orange-dark text-black font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all ml-auto">
              Next <FontAwesomeIcon icon={faArrowRight} className="w-3 h-3" />
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={submitting} className="inline-flex items-center gap-2 px-6 py-3 bg-pawport-orange hover:bg-pawport-orange-dark text-black font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all ml-auto disabled:opacity-50">
              <FontAwesomeIcon icon={faWhatsapp} className="w-3.5 h-3.5" />
              {submitting ? 'Sending…' : 'Send via WhatsApp'}
            </button>
          )}
        </div>
      </div>
    </section>
  )
}

export default BookingForm
