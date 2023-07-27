const { DateTime } = require("luxon");
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const AuthorSchema = new Schema({
  first_name: { type: String, required: true, maxLength: 100 },
  family_name: { type: String, required: true, maxLength: 100 },
  date_of_birth: { type: Date },
  date_of_death: { type: Date },
});

// Virtual for author's full name
AuthorSchema.virtual("name").get(function () {
  // To avoid errors in cases where an author does not have either a family name or first name
  // We want to make sure we handle the exception by returning an empty string for that case
  let fullName = "";
  if (this.first_name && this.family_name) {
    fullName = `${this.family_name}, ${this.first_name}`;
  }

  return fullName;
});

// Virtual for author's URL
AuthorSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/catalog/author/${this._id}`;
});

// Virtual for author form
AuthorSchema.virtual('date_of_birth_yyyy_mm_dd').get(function () {
  return this.date_of_birth ? `${this.date_of_birth.getFullYear()}-${String(this.date_of_birth.getMonth() + 1).padStart(2, '0')}-${String(this.date_of_birth.getDate()).padStart(2, '0')}` : '';
});

AuthorSchema.virtual('date_of_death_yyyy_mm_dd').get(function () {
  return this.date_of_death ? `${this.date_of_death.getFullYear()}-${String(this.date_of_death.getMonth() + 1).padStart(2, '0')}-${String(this.date_of_death.getDate()).padStart(2, '0')}` : '';
});

AuthorSchema.virtual('lifespan').get(function () {
  const birth = this.date_of_birth ? DateTime.fromJSDate(this.date_of_birth).toLocaleString(DateTime.DATE_MED) : '';
  const death = this.date_of_death ? DateTime.fromJSDate(this.date_of_death).toLocaleString(DateTime.DATE_MED) : '';
  return `${birth} - ${death}`;
}); 

// Export model
module.exports = mongoose.model("Author", AuthorSchema);
