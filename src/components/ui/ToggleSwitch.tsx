import React from 'react';

export const ToggleSwitch = ({ checked, onChange, disabled = false }: { checked: boolean, onChange: (v: boolean) => void, disabled?: boolean }) => {
  return (
    <>
      <label className="flex">
        <input 
          id="checkboxInput" 
          type="checkbox" 
          checked={checked} 
          onChange={(e) => onChange(e.target.checked)} 
          disabled={disabled}
        />
        <div className="toggleSwitch" />
      </label>
      <style dangerouslySetInnerHTML={{__html: `
        #checkboxInput {
          display: none;
        }

        .toggleSwitch {
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          width: 50px;
          height: 30px;
          background-color: rgb(82, 82, 82);
          border-radius: 20px;
          cursor: pointer;
          transition-duration: .2s;
        }

        .toggleSwitch::after {
          content: "";
          position: absolute;
          height: 20px;
          width: 20px;
          left: 5px;
          background-color: transparent;
          border-radius: 50%;
          transition-duration: .2s;
          box-shadow: 5px 2px 7px rgba(8, 8, 8, 0.26);
          border: 0 solid white;
          background: white;
        }

        #checkboxInput:checked+.toggleSwitch::after {
          transform: translateX(20px);
          transition-duration: .2s;
          background-color: white;
        }
        /* Switch background change */
        #checkboxInput:checked+.toggleSwitch {
          background-color: rgb(148, 118, 255);
          transition-duration: .2s;
        }
      `}} />
    </>
  );
};
