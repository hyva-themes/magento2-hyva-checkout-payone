export default class ResponseUtility {
  constructor(response) {
    this.response = response;
  }

  isValid() {
    return !!(this.response && this.response.get('status') === 'VALID');
  }

  isBlocked() {
    return !!(this.response && this.response.get('status') === 'BLOCKED');
  }

  getMessage() {
    return (this.response && this.response.get('customermessage')) || '';
  }
}
