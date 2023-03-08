import { nanoid } from 'nanoid';
import { Component } from 'react';
import { ContactForm } from './ContactForm/ContactForm';
import { Contacts } from './Contacts/Contacts';
import { Navbar } from './Navbar/Navbar';
import 'react-notifications/lib/notifications.css';
import {
  NotificationContainer,
  NotificationManager,
} from 'react-notifications';

export class App extends Component {
  state = {
    contacts: [],
    filter: '',
    name: '',
    number: '',
  };

  addContact = ({ name, number }) => {
    const { contacts } = this.state;
    const contact = { id: nanoid(), name, number };
    contacts.some(el => el.name === name)
      ? NotificationManager.error(
          `${name} is already on the contacts list`,
          '',
          2500,
          () => {
            alert('callback');
          }
        )
      : this.setState(({ contacts }) => ({
          contacts: [contact, ...contacts],
        }));
  };

  getContacts = () => {
    const { contacts, filter } = this.state;
    return contacts.filter(contact =>
      contact.name.toLowerCase().includes(filter)
    );
  };

  searchContacts = e => {
    e.preventDefault();

    const value = e.target.value.toLowerCase();
    this.setState({ filter: value });
  };

  removeContact = id => {
    this.setState(({ contacts }) => ({
      contacts: contacts.filter(contact => contact.id !== id),
    }));
  };

  componentDidMount() {
    const contacts = localStorage.getItem('contacts');
    const parsedContacts = JSON.parse(contacts);
    if (parsedContacts) {
      this.setState({ contacts: parsedContacts });
    }
  }

  componentDidUpdate(prevState) {
    const nextContacts = this.state.contacts;
    const prevContacts = prevState.contacts;
    if (nextContacts !== prevContacts) {
      localStorage.setItem('contacts', JSON.stringify(nextContacts));
    }
  }

  render() {
    return (
      <>
        <Navbar search={this.searchContacts} />
        <div className="container">
          <div className="row">
            <div className="col-sm-12">
              <ContactForm onSubmit={this.addContact} />
            </div>
          </div>
          <div className="row">
            <div className="col-sm-6 mx-auto mt-5">
              <Contacts
                contactsArr={this.getContacts()}
                remove={this.removeContact}
              />
            </div>
          </div>
        </div>
        <NotificationContainer />
      </>
    );
  }
}
