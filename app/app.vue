<script setup lang="ts">

useHead({
  title: 'News App - By DUDUN',
})

// fetch API langsung
const { data, pending, error } = await useAsyncData('articles', () =>
  $fetch('https://api.npoint.io/749e4cc46af7d03db38a')
)

const articles = computed(() => data.value?.articles || [])

// state fitur
const search = ref('')
const selectedAuthor = ref('')
const sortBy = ref('newest')
const viewMode = ref('grid') // grid | list

// author unik
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

const fallbackImage = 'https://via.placeholder.com/400x200?text=No+Image'

</script>

<template>
  <div class="container mt-5 mb-5">

    <h2 class="mb-4">📰 News Articles</h2>

    <!-- 🔍 FILTER -->
    <div class="row mb-3">
      <div class="col-md-3">
        <input
          v-model="search"
          class="form-control"
          placeholder="Search article..."
        />
      </div>

      <div class="col-md-3">
        <select v-model="selectedAuthor" class="form-control">
          <option value="">All Authors</option>
          <option v-for="author in authors" :key="author">
            {{ author }}
          </option>
        </select>
      </div>

      <div class="col-md-3">
        <select v-model="sortBy" class="form-control">
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
        </select>
      </div>

      <!-- TOGGLE VIEW -->
      <div class="col-md-3 d-flex gap-2">
        <button
          class="btn btn-outline-primary w-50"
          @click="viewMode = 'grid'"
        >
          Grid
        </button>
        <button
          class="btn btn-outline-secondary w-50"
          @click="viewMode = 'list'"
        >
          List
        </button>
      </div>
    </div>

    <!-- LOADING -->
    <div v-if="pending" class="text-center">
      Loading...
    </div>

    <!-- ERROR -->
    <div v-else-if="error" class="text-danger text-center">
      Failed to load data
    </div>

    <!-- EMPTY -->
    <div v-else-if="filteredArticles.length === 0" class="text-center">
      No articles found 😢
    </div>

    <!-- GRID VIEW -->
    <div v-else-if="viewMode === 'grid'" class="row">
      <div
        v-for="(article, index) in filteredArticles"
        :key="index"
        class="col-md-4 mb-4"
      >
        <div
          class="card h-100 shadow-sm"
          style="cursor:pointer"
          @click="window.open(article.url, '_blank')"
        >
          <img
            :src="article.urlToImage || fallbackImage"
            class="card-img-top"
            style="height:200px; object-fit:cover"
          />

          <div class="card-body">
            <h5 class="card-title">
              {{ article.title }}
            </h5>

            <p class="card-text">
              {{ article.description || 'No description available' }}
            </p>
          </div>

          <div class="card-footer small text-muted">
            {{ article.author || 'Unknown' }} •
            {{ formatDate(article.publishedAt) }}
          </div>
        </div>
      </div>
    </div>

    <!-- LIST VIEW -->
    <div v-else>
      <div
        v-for="(article, index) in filteredArticles"
        :key="index"
        class="card mb-3 shadow-sm"
        style="cursor:pointer"
        @click="window.open(article.url, '_blank')"
      >
        <div class="row g-0">
          <div class="col-md-4">
            <img
              :src="article.urlToImage || fallbackImage"
              class="img-fluid rounded-start"
              style="height:100%; object-fit:cover"
            />
          </div>

          <div class="col-md-8">
            <div class="card-body">
              <h5>{{ article.title }}</h5>

              <p>
                {{ article.description || 'No description available' }}
              </p>

              <small class="text-muted">
                {{ article.author || 'Unknown' }} •
                {{ formatDate(article.publishedAt) }}
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>