const DEFAULT_PAGE_LIMIT = 20
const DEFAULT_PAGE = 10

const getPagination = (query) => {
    const page = Math.abs(query.page) || DEFAULT_PAGE
    const limit = Math.abs(query.limit) || DEFAULT_PAGE_LIMIT
    const skip = (page-1)*limit
    return {
        limit,
        skip
    }
}

module.exports = {
    getPagination
}