'use client'

import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaw, faHeart, faArrowLeft, faArrowRight, faPaperPlane, faCheckCircle, faUpload } from '@fortawesome/free-solid-svg-icons'
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
  const [petImage, setPetImage] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [toast, setToast] = useState(null)

  const showToast = (message, type = 'error') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3500)
  }

  const [form, setForm] = useState({
    petType: '', petName: '', petBreed: '', petAge: '', petWeight: '', petDetails: '',
    pickupPlace: '', dropoffPlace: '', bookingDate: '', preferredTime: '', transportMode: '',
    buyerName: '', buyerWhatsapp: '',
  })

  const update = (field, value) => setForm(f => ({ ...f, [field]: value }))

  const validateStep = () => {
    if (step === 0) {
      if (!form.petType) return 'Please select pet type'
      if (!petImage) return 'Please upload a pet photo'
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
      if (!/^[+]?[\d\s-]{10,15}$/.test(form.buyerWhatsapp)) return 'Please enter a valid phone number'
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

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) { showToast('Only image files are allowed'); return }
    if (file.size / 1024 / 1024 > 5) { showToast('Image must be smaller than 5MB'); return }
    setPetImage(file)
    const reader = new FileReader()
    reader.onload = (ev) => setPreviewUrl(ev.target.result)
    reader.readAsDataURL(file)
  }

  const handleSubmit = async () => {
    const err = validateStep()
    if (err) { showToast(err); return }
    setSubmitting(true)

    try {
      const fd = new FormData()
      fd.append('buyerName', form.buyerName)
      fd.append('buyerWhatsapp', form.buyerWhatsapp)
      fd.append('petName', form.petName)
      fd.append('petType', form.petType)
      fd.append('petBreed', form.petBreed)
      fd.append('petAge', form.petAge)
      fd.append('petWeight', form.petWeight)
      fd.append('petDetails', form.petDetails)
      fd.append('pickupPlace', form.pickupPlace)
      fd.append('dropoffPlace', form.dropoffPlace)
      fd.append('bookingDate', form.bookingDate)
      fd.append('preferredTime', form.preferredTime)
      fd.append('transportMode', form.transportMode)
      if (petImage) fd.append('petImage', petImage)

      const res = await fetch('/api/orders', {
        method: 'POST',
        body: fd,
      })

      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        throw new Error(data.message || 'Failed to submit booking')
      }

      showToast('Booking sent! Check your WhatsApp for confirmation.', 'success')
      setShowConfirmation(true)
      setForm({ petType: '', petName: '', petBreed: '', petAge: '', petWeight: '', petDetails: '', pickupPlace: '', dropoffPlace: '', bookingDate: '', preferredTime: '', transportMode: '', buyerName: '', buyerWhatsapp: '' })
      setPetImage(null)
      setPreviewUrl('')
      setStep(0)
    } catch (err) {
      console.error('Submit failed:', err)
      showToast(err.message || 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const InputClass = "w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-black placeholder-gray-400 focus:border-pawport-orange focus:outline-none transition-colors text-sm font-body"
  const LabelClass = "block text-xs font-bold uppercase tracking-wider text-black mb-1.5 font-body"
  const SelectClass = "w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-black focus:border-pawport-orange focus:outline-none transition-colors text-sm font-body appearance-none cursor-pointer"

  if (showConfirmation) {
    return (
      <section className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 bg-white">
        <div className="text-center max-w-md space-y-6 py-10">
          <FontAwesomeIcon icon={faCheckCircle} className="text-6xl text-pawport-orange" />
          <div>
            <h2 className="text-2xl font-extrabold font-space text-black mb-2">Booking Sent! 🎉</h2>
            <p className="text-sm text-pawport-muted">Your booking details have been sent to the transporter and a confirmation has been sent to your WhatsApp. Check your WhatsApp!</p>
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
            toast.type === 'success'
              ? 'bg-green-500 text-white'
              : 'bg-pawport-orange text-black'
          }`}>
            <span>{toast.type === 'success' ? '✓' : '⚠'}</span>
            <span>{toast.message}</span>
          </div>
        </div>
      )}
      <div className="max-w-lg md:max-w-3xl mx-auto w-full md:h-full md:py-4 md:px-6 md:flex md:flex-col">
        {/* Header */}
        <div className="text-center mb-6 md:mb-2 md:shrink-0">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-pawport-orange/20 text-pawport-orange rounded-full text-[11px] font-bold uppercase tracking-widest mb-2 md:mb-2">
            <FontAwesomeIcon icon={faHeart} className="w-3 h-3" /> Book Now
          </span>
          <h2 className="text-2xl md:text-2xl font-extrabold tracking-tight font-space text-black mb-1">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-stretch">
                <div>
                  <label htmlFor="petDetails" className={LabelClass}>Pet Details</label>
                  <textarea id="petDetails" value={form.petDetails} onChange={e => update('petDetails', e.target.value)} placeholder="Temperament, medical needs..." className={`${InputClass} resize-none h-24`} />
                </div>
                <div>
                  <label className={LabelClass}>Pet Photo *</label>
                  {previewUrl ? (
                    <div className="relative inline-block">
                      <img src={previewUrl} alt="Preview" className="w-24 h-24 object-cover rounded-xl border-2 border-pawport-orange" />
                      <button onClick={() => { setPetImage(null); setPreviewUrl('') }} className="absolute -top-2 -right-2 w-6 h-6 bg-black text-white rounded-full text-xs flex items-center justify-center">×</button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center gap-2 w-full h-24 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-pawport-orange transition-colors">
                      <FontAwesomeIcon icon={faUpload} className="text-gray-400 text-lg" />
                      <span className="text-xs text-gray-400">Click to upload photo</span>
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                  )}
                </div>
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
                  <input id="buyerWhatsapp" type="tel" value={form.buyerWhatsapp} onChange={e => update('buyerWhatsapp', e.target.value)} placeholder="+91 98765 43210" className={InputClass} />
                </div>
              </div>
              <div className="bg-pawport-orange/5 border border-pawport-orange/15 rounded-xl p-4">
                <p className="text-xs text-pawport-muted leading-relaxed">
                  <FontAwesomeIcon icon={faPaw} className="text-pawport-orange mr-1" />
                  Your booking details and pet photo will be sent directly to the transporter via WhatsApp. You'll receive a confirmation shortly.
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
              {submitting ? 'Sending...' : 'Send via WhatsApp'}
            </button>
          )}
        </div>
      </div>
    </section>
  )
}

export default BookingForm