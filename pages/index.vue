<script setup lang="ts">

useHead({
  title: 'News Articles - Nuxt App',
})

// fetch langsung dari API
const { data, pending, error } = await useAsyncData('articles', () =>
  $fetch('https://api.npoint.io/749e4cc46af7d03db38a')
)

// ambil data articles
const articles = computed(() => data.value?.articles || [])

// state fitur
const search = ref('')
const selectedAuthor = ref('')
const sortBy = ref('newest')

// ambil author unik
const authors = computed(() => {
  const list = articles.value.map(a => a.author || 'Unknown')
  return [...new Set(list)].filter(a => a)
})

// filtering + sorting
const filteredArticles = computed(() => {
  let result = articles.value

  // SEARCH
  if (search.value) {
    result = result.filter(a =>
      (a.title || '').toLowerCase().includes(search.value.toLowerCase())
    )
  }

  // FILTER AUTHOR
  if (selectedAuthor.value) {
    result = result.filter(a =>
      (a.author || 'Unknown') === selectedAuthor.value
    )
  }

  // SORT
  result = [...result].sort((a, b) => {
    const dateA = new Date(a.publishedAt)
    const dateB = new Date(b.publishedAt)

    return sortBy.value === 'newest'
      ? dateB.getTime() - dateA.getTime()
      : dateA.getTime() - dateB.getTime()
  })

  return result
})

// helper
const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

const fallbackImage = 'https://via.placeholder.com/150x100?text=No+Image'

</script>

<template>
  <div class="container mt-5 mb-5">
    
    <h2 class="mb-4">📰 News Articles</h2>

    <!-- 🔍 FILTER -->
    <div class="row mb-3">
      <div class="col-md-4">
        <input
          v-model="search"
          type="text"
          class="form-control"
          placeholder="Search title..."
        />
      </div>

      <div class="col-md-4">
        <select v-model="selectedAuthor" class="form-control">
          <option value="">All Authors</option>
          <option v-for="author in authors" :key="author" :value="author">
            {{ author }}
          </option>
        </select>
      </div>

      <div class="col-md-4">
        <select v-model="sortBy" class="form-control">
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
        </select>
      </div>
    </div>

    <div class="card border-0 rounded shadow">
      <div class="card-body">

        <!-- LOADING -->
        <div v-if="pending" class="text-center">
          Loading articles...
        </div>

        <!-- ERROR -->
        <div v-else-if="error" class="text-danger text-center">
          Failed to load data
        </div>

        <!-- EMPTY -->
        <div v-else-if="filteredArticles.length === 0" class="text-center">
          No articles found 😢
        </div>

        <!-- TABLE -->
        <table v-else class="table table-bordered">
          <thead class="bg-dark text-white">
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Author</th>
              <th>Source</th>
              <th>Date</th>
              <th>Link</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="(article, index) in filteredArticles" :key="index">
              
              <td class="text-center">
                <img
                  :src="article.urlToImage || fallbackImage"
                  width="120"
                  class="rounded"
                />
              </td>

              <td>{{ article.title }}</td>

              <td>{{ article.author || 'Unknown' }}</td>

              <td>{{ article.source?.name }}</td>

              <td>{{ formatDate(article.publishedAt) }}</td>

              <td class="text-center">
                <a
                  :href="article.url"
                  target="_blank"
                  class="btn btn-sm btn-primary"
                >
                  View
                </a>
              </td>

            </tr>
          </tbody>
        </table>

      </div>
    </div>

  </div>
</template>