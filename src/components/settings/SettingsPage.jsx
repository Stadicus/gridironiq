import { useState } from 'react'
import { saveSettings, exportData, importData, resetAll } from '../../utils/storage'
import { DIFFICULTY } from '../../utils/difficultyConfig'

export default function SettingsPage({ onNavigate, data }) {
  const settings = data?.settings || {}
  const [diff, setDiff] = useState(settings.difficulty || 'medium')
  const [sound, setSound] = useState(settings.soundEnabled !== false)
  const [theme, setTheme] = useState(settings.theme || 'light')
  const [saved, setSaved] = useState(false)
  const [importError, setImportError] = useState(null)
  const [confirmReset, setConfirmReset] = useState(false)

  function save() {
    saveSettings({ difficulty: diff, soundEnabled: sound, theme })
    document.documentElement.classList.toggle('dark', theme === 'dark')
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  function handleExport() {
    const json = exportData()
    const blob = new Blob([json], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `gridiron-iq-progress-${new Date().toISOString().split('T')[0]}.json`
    a.click()
  }

  function handleImport(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const ok = importData(ev.target.result)
      if (!ok) setImportError('Invalid file. Please export a valid Gridiron IQ backup.')
      else { setImportError(null); onNavigate('dashboard') }
    }
    reader.readAsText(file)
  }

  function handleReset() {
    if (confirmReset) {
      resetAll()
      setConfirmReset(false)
      onNavigate('dashboard')
    } else {
      setConfirmReset(true)
      setTimeout(() => setConfirmReset(false), 5000)
    }
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-6 flex flex-col gap-5">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">⚙️ Settings</h1>

      {/* Difficulty */}
      <div className="card">
        <h2 className="font-semibold text-slate-700 dark:text-slate-300 mb-3">Default Difficulty</h2>
        <div className="grid grid-cols-3 gap-2">
          {Object.entries(DIFFICULTY).map(([key, d]) => (
            <button
              key={key}
              onClick={() => setDiff(key)}
              className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 text-sm transition-all ${
                diff === key
                  ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
              }`}
            >
              <span className="text-xl">{d.emoji}</span>
              <span className="font-semibold">{d.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Theme */}
      <div className="card">
        <h2 className="font-semibold text-slate-700 dark:text-slate-300 mb-3">Theme</h2>
        <div className="grid grid-cols-2 gap-2">
          {[['light','☀️ Light'],['dark','🌙 Dark']].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTheme(key)}
              className={`p-3 rounded-xl border-2 font-medium transition-all ${
                theme === key
                  ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Sound */}
      <div className="card flex items-center justify-between">
        <div>
          <div className="font-semibold text-slate-700 dark:text-slate-300">Sound Effects</div>
          <div className="text-xs text-slate-400">Audio feedback on correct/wrong answers</div>
        </div>
        <button
          onClick={() => setSound(s => !s)}
          className={`relative w-12 h-7 rounded-full transition-colors ${sound ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-600'}`}
        >
          <div className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow transition-all ${sound ? 'left-6' : 'left-0.5'}`} />
        </button>
      </div>

      {/* Save */}
      <button onClick={save} className={`btn-primary py-3 transition-all ${saved ? 'bg-green-600' : ''}`}>
        {saved ? '✓ Saved!' : 'Save Settings'}
      </button>

      {/* Data management */}
      <div className="card">
        <h2 className="font-semibold text-slate-700 dark:text-slate-300 mb-3">Data</h2>
        <div className="flex flex-col gap-2">
          <button onClick={handleExport} className="btn-secondary py-2.5 text-sm">
            📤 Export Progress (JSON)
          </button>
          <label className="btn-secondary py-2.5 text-sm text-center cursor-pointer">
            📥 Import Progress
            <input type="file" accept=".json" onChange={handleImport} className="hidden" />
          </label>
          {importError && <p className="text-sm text-red-600">{importError}</p>}
        </div>
      </div>

      {/* Reset */}
      <div className="card border-red-200 dark:border-red-900">
        <h2 className="font-semibold text-red-600 dark:text-red-400 mb-1">Danger Zone</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">This will erase all your progress, XP, badges, and stats permanently.</p>
        <button
          onClick={handleReset}
          className={`py-2.5 text-sm font-semibold rounded-xl w-full transition-all ${
            confirmReset
              ? 'bg-red-600 text-white'
              : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800'
          }`}
        >
          {confirmReset ? '⚠️ Click again to confirm reset' : '🗑️ Reset All Progress'}
        </button>
      </div>
    </div>
  )
}
