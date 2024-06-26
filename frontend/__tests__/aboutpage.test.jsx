import React from 'react';
import { render, screen } from '@testing-library/react';
import AboutPage from '../src/app/(customer)/about/page'; // Assuming AboutPage is in a separate file

describe('AboutPage component', () => {
  test('renders the correct title', () => {
    render(<AboutPage />);
    const title = screen.getByText(/About Rev's American Grill/i);
    expect(title).toBeInTheDocument();
  });

  test('renders the welcome message', () => {
    render(<AboutPage />);
    const welcomeText = screen.getByText(/Welcome to Rev's American Grill/i);
    expect(welcomeText).toBeInTheDocument();
  });

  test('renders a description of the restaurant\'s offerings', () => {
    render(<AboutPage />);
    const descriptionText = screen.getByText(/We specialize in serving delicious American-style grilled dishes/i);
    expect(descriptionText).toBeInTheDocument();
  });

  test('renders a description of the restaurant\'s atmosphere', () => {
    render(<AboutPage />);
    const atmosphereText = screen.getByText(/Our restaurant offers a cozy and inviting atmosphere/i);
    expect(atmosphereText).toBeInTheDocument();
  });

  test('renders an invitation to visit the restaurant', () => {
    render(<AboutPage />);
    const invitationText = screen.getByText(/Come visit us at the MSC and experience the taste of Rev's American Grill!/i);
    expect(invitationText).toBeInTheDocument();
  });

});
