import api from './apiClient.js'

const blueprintsPath = import.meta.env.VITE_BLUEPRINTS_PATH || '/api/v1/blueprints'

function unwrapApiResponse(payload) {
  if (payload && typeof payload === 'object' && 'data' in payload) {
    return payload.data
  }
  return payload
}

const apiclient = {
  async getAll() {
    const { data } = await api.get(blueprintsPath)
    return unwrapApiResponse(data)
  },

  async getByAuthor(author) {
    const { data } = await api.get(`${blueprintsPath}/${encodeURIComponent(author)}`)
    return unwrapApiResponse(data)
  },

  async getByAuthorAndName(author, name) {
    const { data } = await api.get(
      `${blueprintsPath}/${encodeURIComponent(author)}/${encodeURIComponent(name)}`,
    )
    return unwrapApiResponse(data)
  },

  async create(payload) {
    const { data } = await api.post(blueprintsPath, payload)
    return unwrapApiResponse(data)
  },

  async addPoint(author, name, point) {
    const { data } = await api.put(
      `${blueprintsPath}/${encodeURIComponent(author)}/${encodeURIComponent(name)}/points`,
      point,
    )
    return unwrapApiResponse(data)
  },
}

export default apiclient
