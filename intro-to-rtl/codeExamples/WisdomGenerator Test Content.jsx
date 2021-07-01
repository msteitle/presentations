import React from 'react';
import { render, screen, fireEvent, waitForElementToBeRemoved } from '@testing-library/react';
import { WisdomGenerator } from '..';
import { doFetch } from '../api';

jest.mock('../api');

/**
 * 1. Explain base setup
 *   1. Mocked our service
 *   2. Wrote out failing test assertions (basic TDD)
 * 2. First test
 *   1. Import render function.
 *   2. Demonstrate screen.debug()
 *   3. Ok, we want to test that the button is here.
 */

describe('WisdomGenerator', () => {
    const defaultQuotes = [
        { author: "Keanu Reeves", message: "Woah" },
        { author: "Sinatra", message: "Do Be Do Be Do" },
        { author: "Socrates", message: "To be is to do" },
        { author: "Sartre", message: "To do is to be" },
    ];

    beforeEach(() => {
        jest.resetAllMocks();
        doFetch.mockImplementationOnce(() => Promise.resolve([defaultQuotes[0]]));
    });

    it('renders a trigger to display wisdom', () => {
        // no need to capture any return value. That's what screen is for.
        render(<WisdomGenerator />);

        expect(screen.getByText(/receive wisdom/i)).toBeInTheDocument();
    });

    it('does not display wisdom initially', () => {
        render(<WisdomGenerator />);

        expect(screen.queryByText(defaultQuotes[0].message)).not.toBeInTheDocument();
    });
    
    it('displays a piece of wisdom with attribution each time the button is pressed', async () => {
        render(<WisdomGenerator />);

        fireEvent.click(screen.getByText('Receive Wisdom'));

        // what happens if we remove this?
        expect(await screen.findByText(defaultQuotes[0].message)).toBeInTheDocument();
        expect(await screen.findByText(defaultQuotes[0].author, { exact: false })).toBeInTheDocument();

        doFetch.mockImplementationOnce(() => Promise.resolve([defaultQuotes[1]]));

        fireEvent.click(screen.getByText('Receive Wisdom'));

        expect(screen.queryByText(defaultQuotes[0].message)).not.toBeInTheDocument();
        expect(screen.queryByText(defaultQuotes[0].author, { exact: false })).not.toBeInTheDocument();
        expect(await screen.findByText(defaultQuotes[1].message)).toBeInTheDocument();
        expect(await screen.findByText(defaultQuotes[1].author, { exact: false })).toBeInTheDocument();
    });

    it('will block additional requests until the active request completes', async () => {
        render(<WisdomGenerator />);

        doFetch.mockImplementationOnce(() => {
            setTimeout(() => {
                Promise.resolve([...defaultQuotes]);
            }, 5000);
        });
        // we need to use fake timers so that we can run all timers and simulate a response delay
        jest.useFakeTimers();

        fireEvent.click(screen.getByText(/receive wisdom/i));
        doFetch.mockImplementationOnce(() => Promise.resolve([defaultQuotes[1]]));
        fireEvent.click(screen.getByText(/receive wisdom/i));

        jest.runAllTimers();
        
        expect(await screen.findByText(defaultQuotes[0].message)).toBeInTheDocument();
        expect(screen.queryByText(defaultQuotes[1].message)).not.toBeInTheDocument();
    });

    it('displays a loading indicator while loading which disappears when load completes', async () => {
        render(<WisdomGenerator />);

        const toggle = screen.getByText(/receive wisdom/i);

        doFetch.mockImplementationOnce(() => {
            setTimeout(() => {
                Promise.resolve([defaultQuote]);
            }, 1000);
        });

        fireEvent.click(toggle);

        expect(screen.getByLabelText('Loading indicator')).toBeInTheDocument();
        expect(await screen.findByText(defaultQuotes[0].message)).toBeInTheDocument();
    });
});