import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.9/vue.esm-browser.js';

createApp({
  data() {
    return {
      apiUrl: 'https://vue3-course-api.hexschool.io',
      user: {
        username: '',
        password: '',
      },
      page: '',
    };
  },
  methods: {
    login() {
      const api = `${this.apiUrl}/admin/signin`;
      // eslint-disable-next-line no-undef
      axios.post(api, this.user).then((res) => {
        if (res.data.success) {
          const { token, expired } = res.data;
          document.cookie = `hexToken=${token}; expires=${new Date(expired)}/`;
          window.location = 'products.html';
        } else {
          // eslint-disable-next-line no-alert
          alert(res.data.message);
        }
      })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.log(error);
        });
    },
  },
}).mount('#app');
