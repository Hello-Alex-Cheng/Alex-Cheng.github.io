export default {
  template: `
    <div>
      <h3>comp input value </h3>
      <input :value="compValue" @input="$emit('change', $event.target.value)" />  
    </div>
  `,
  model: {
    prop: 'compValue',
    event: 'change',
  },
  props: {
    compValue: {
      text: String,
      default: ''
    }
  }
}