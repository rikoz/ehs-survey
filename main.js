var app = new Vue({
  el: '#app',
  data() {
    return {
      message: 'Hello Vue!',
      survey: null,
      answers: []
    }
  },
  methods: {
    async fetchQuestion () {
      await axios.get('https://esh-survey.herokuapp.com/2/936825c1-2c15-43bb-9d7b-13d8d807857d')
        .then(resp => {
          this.survey = resp.data
          this.answers = this.survey.data.questions.map(question => {
            return {
              question: question.id,
              text: question.answer_type == 'Multiselect' ? [] : (question.answer_type == 'Rating' ? new Array(question.options.split('\r\n').length) : ''),
              patient: '936825c1-2c15-43bb-9d7b-13d8d807857d'
            }
          })
        })
        .catch(err => {
          console.log(err)
        })
    },
    submitAnswers () {
      axios.post('https://esh-survey.herokuapp.com/2/936825c1-2c15-43bb-9d7b-13d8d807857d', {
        text: this.answers
      })
        .then(resp => {
          console.log(resp)
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

      console.log(theObj)
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