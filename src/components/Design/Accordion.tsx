import { useId, useState } from 'react';

import PlusIcon from 'mdi-react/PlusIcon';
import MinusIcon from 'mdi-react/MinusIcon';

import Colors from '@data/colors.json';

export interface AccordionProps {
  heading: string;
  children: React.ReactNode;
  headingComponent?: React.ElementType;
}

export default function Accordion({ heading, children, headingComponent: HeadingComponent = 'h2' }: AccordionProps) {
  const rootId = useId();

  const buttonId = `accordion-button-${rootId}`;
  const panelId = `accordion-panel-${rootId}`;

  const [isOpen, setIsOpen] = useState<boolean>(false);

  function toggleExpanded() {
    setIsOpen((prevIsOpen) => !prevIsOpen);
  }

  return (
    <div
      className="Accordion"
      css={{
        border: '2px solid black',
        backgroundColor: 'white',
        '& + &': {
          borderTop: 'none',
        },
      }}
    >
      <HeadingComponent className="Accordion-heading" css={{ margin: 0 }}>
        <button
          type="button"
          className="Button--ua-reset Accordion-headingButton"
          id={buttonId}
          aria-controls={panelId}
          aria-expanded={isOpen}
          onClick={toggleExpanded}
          css={{
            margin: 0,
            backgroundColor: Colors.lightGrey,
            padding: '8px 16px',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            cursor: 'pointer',
          }}
        >
          <span css={{ display: 'flex', marginRight: 4 }}>
            {!isOpen && <PlusIcon />}
            {isOpen && <MinusIcon />}
          </span>

          {heading}
        </button>
      </HeadingComponent>
      <div className="Accordion-panel" id={panelId} aria-labelledby={buttonId}>
        {isOpen && (
          <div className="Accordion-panelContent" css={{ padding: 16, borderTop: '2px solid black' }}>
            {children}
          </div>
        )}
      </div>
    </div>
  );
}
