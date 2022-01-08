Vue.use(VueMaterial.default);

const BASE_URL = 'http://localhost:3000/api';
const NEW_COMMAND_SWAL_FORM = (title, command = null) => {
  return {
    title,
    width: '80%',
    html: `
       <input id="swal-input1" class="swal2-input" placeholder="Comando ej: !chau"
           value="${command ? command.name : ''}">
       <br/>
       <input id="swal-input2" class="swal2-input" placeholder="ej: Hasta la proximaaa"
           value="${command ? command.value : ''}">
       `,
    preConfirm: function () {
      return new Promise(function (resolve) {
        // Validate input
        if ($('#swal-input1').val() == '' || $('#swal-input2').val() == '') {
          Swal.showValidationMessage('No puedes dejar campos vacios'); // Show error when validation fails.
          Swal.enableButtons();
        } else {
          Swal.resetValidationMessage(); // Reset the validation message.
          resolve([$('#swal-input1').val(), $('#swal-input2').val()]);
        }
      });
    },
  };
};

new Vue({
  el: '#app',

  async created() {
    const res = await axios.get(`${BASE_URL}/commands`);
    this.commands = res.data.commands;
  },
  methods: {
    editCommand(command) {
      Swal.fire(NEW_COMMAND_SWAL_FORM('Editar comando', command))
        .then(async (form) => {
          const { data } = await axios.put(`${BASE_URL}/commands/edit`, {
            oldOne: { name: command.name, value: command.value },
            newOne: { name: form.value[0], value: form.value[1] },
          });
          this.commands = data.commands;
        })
        .catch(swal.noop);
    },
    addCommand() {
      Swal.fire(NEW_COMMAND_SWAL_FORM('Agregar Comando')).then(async (form) => {
        const res = await axios.post(`${BASE_URL}/commands`, {
          name: form.value[0],
          value: form.value[1],
        });
        this.commands = res.data.commands;
      });
    },
    deleteCommand(command) {
      Swal.fire({
        title: '¿Seguro que lo queres borrar?',
        icon: 'warning',
        html: `<h2>Comando: <span class="primary">${command.name}</span></h2>
               <pre>${command.value}</pre>`,
        showCancelButton: true,
        confirmButtonText: 'Borrar',
      }).then(async (result) => {
        if (result.isConfirmed) {
          const { status, data } = await axios.post(`${BASE_URL}/commands/delete`, {
            name: command.name,
            value: command.value,
          });
          if (status == 200) {
            Swal.fire('Borrado', '', 'success');
            this.commands = data.commands;
          }
        }
      });
    },
  },
  data: () => ({
    menuVisible: false,
    menuOptions: [
      {
        text: 'Agregar comandos',
        icon: 'error',
      },
    ],

    commands: [],
  }),
});
