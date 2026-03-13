import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { appendPoint, fetchBlueprint } from '../features/blueprints/blueprintsSlice.js'
import BlueprintCanvas from '../components/BlueprintCanvas.jsx'
import { isAuthenticated } from '../services/authStorage.js'

export default function BlueprintDetailPage() {
  const { author, name } = useParams()
  const dispatch = useDispatch()
  const { current: bp, status, error } = useSelector((s) => s.blueprints)
  const [x, setX] = useState('')
  const [y, setY] = useState('')
  const [localError, setLocalError] = useState('')

  useEffect(() => {
    dispatch(fetchBlueprint({ author, name }))
  }, [author, name, dispatch])

  const submitPoint = async (event) => {
    event.preventDefault()
    setLocalError('')

    const parsedX = Number(x)
    const parsedY = Number(y)
    if (Number.isNaN(parsedX) || Number.isNaN(parsedY)) {
      setLocalError('Debes ingresar coordenadas numericas validas.')
      return
    }

    const result = await dispatch(
      appendPoint({
        author,
        name,
        point: { x: parsedX, y: parsedY },
      }),
    )

    if (appendPoint.fulfilled.match(result)) {
      setX('')
      setY('')
    }
  }

  if (!bp)
    return (
      <div className="card">
        <p>{status.current === 'loading' ? 'Cargando...' : 'No se encontro el blueprint solicitado.'}</p>
        {error.current && <p className="error-text">{error.current}</p>}
      </div>
    )

  return (
    <div className="grid" style={{ gridTemplateColumns: '1fr 1.2fr', gap: 24 }}>
      <section className="card">
        <h2 style={{ marginTop: 0 }}>{bp.name}</h2>
        <p>
          <strong>Autor:</strong> {bp.author}
        </p>
        <p>
          <strong>Puntos:</strong> {bp.points?.length || 0}
        </p>
        {!isAuthenticated() && (
          <p style={{ color: '#94a3b8', marginBottom: 0 }}>
            Inicia sesion para agregar puntos a este blueprint.
          </p>
        )}
        {isAuthenticated() && (
          <form onSubmit={submitPoint} className="grid cols-2" style={{ marginTop: 12 }}>
            <div>
              <label htmlFor="point-x">X</label>
              <input
                id="point-x"
                className="input"
                value={x}
                onChange={(event) => setX(event.target.value)}
              />
            </div>
            <div>
              <label htmlFor="point-y">Y</label>
              <input
                id="point-y"
                className="input"
                value={y}
                onChange={(event) => setY(event.target.value)}
              />
            </div>
            <div style={{ gridColumn: '1 / -1', display: 'flex', gap: 10 }}>
              <button
                className="btn primary"
                type="submit"
                disabled={status.appendPoint === 'loading'}
              >
                {status.appendPoint === 'loading' ? 'Agregando...' : 'Agregar punto'}
              </button>
            </div>
            {(localError || error.appendPoint) && (
              <p style={{ gridColumn: '1 / -1' }} className="error-text">
                {localError || error.appendPoint}
              </p>
            )}
          </form>
        )}
      </section>

      <section className="card">
        <h3 style={{ marginTop: 0 }}>Visualizacion del plano</h3>
        <BlueprintCanvas points={bp.points || []} />
      </section>
    </div>
  )
}
