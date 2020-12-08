var app = new Vue({
  el: '#app',
  data() {
    return {
      paramz: window.location.pathname,
      apiURL: 'https://esh-survey.herokuapp.com',
      survey: null,
      answers: [],
      submitted: false,
      message: '',
      error: false,
      loading: false
    }
  },
  methods: {
    async fetchQuestion () {
      const parth = this.paramz == '/' ? '/1/6a3ee186-1287-4352-8213-3f1acf194b8f' : this.paramz

      await axios.get(`${this.apiURL}${parth}`)
        .then(resp => {
          this.survey = resp.data
          this.answers = this.survey.data.questions.map(question => {
            return {
              question: question.id,
              text: question.answer_type == 'Multiselect' ? [] : (question.answer_type == 'Rating' ? new Array(question.options.split('\r\n').length) : '')
            }
          })
        })
        .catch(err => {
          this.message = err.response.data.message
          this.error = true
        })
    },

    submitAnswers () {
      this.loading = true
      axios.post(`${this.apiURL}${this.paramz}`, {
        text: this.answers
      })
        .then(resp => {
          if (resp.status == 200 && resp.data.status == 'success') {
            this.message = resp.data.message
            this.submitted = true
            this.survey = null
          } else {
            this.message = resp.data.message
          }
        })
        .catch(err => {
          this.message = err.response.data.message
          this.loading = false
          this.error = true
        })
    },

    handleMSelect (e) {
      const qid = e.srcElement.id
      const itemIndex = this.answers.findIndex(entry => entry.question == qid)
      const theObj = this.answers[itemIndex]
      
      if (e.target.checked) {
        theObj.text.push(e.target.value)
      } else {
        const itemIndex = theObj.text.indexOf(e.target.value)
        theObj.text.splice(itemIndex, 1)
      }
    },

    handleRating (e) {
      const qid = e.srcElement.name.split('-')[0]
      const itemIndex = this.answers.findIndex(entry => entry.question == qid)
      const theObj = this.answers[itemIndex]

      const optionId = e.srcElement.id.split('-')[1]
      
      if (e.target.checked) {
        theObj.text[optionId-1] = e.target.value
      }
    },

    handleText (e) {
      const qid = e.srcElement.id
      const itemIndex = this.answers.findIndex(entry => entry.question == qid)
      const theObj = this.answers[itemIndex]
      
      theObj.text = e.target.value
    }
  },
  created () {
    this.fetchQuestion()
  }
})