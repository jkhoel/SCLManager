import { Fragment, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";

import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";

export type StyledListBoxItem = {
  id: string | number;
  label: string;
  value: string | number;
};

export type StyledListBoxProps = {
  items: StyledListBoxItem[];
  callback: (selectedItem: StyledListBoxItem) => void;
};

const StyledListBox: React.FC<StyledListBoxProps> = ({
  items,
  callback,
  ...rest
}) => {
  const [selectedItem, setSelectedItem] = useState<StyledListBoxItem>(items[0]);

  const handleSelect = (selectedItem: StyledListBoxItem) => {
    callback(selectedItem);
    setSelectedItem(selectedItem);
  };

  return (
    <Listbox value={selectedItem} onChange={handleSelect} {...rest}>
      <div className="relative">
        <Listbox.Button className="relative min-w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
          <span className="block truncate">{selectedItem.label}</span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronUpDownIcon
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </span>
        </Listbox.Button>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Listbox.Options className="absolute z-50 mt-1 max-h-60 min-w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {items.map((item, itemIdx) => (
              <Listbox.Option
                key={itemIdx}
                className={({ active }) =>
                  `relative cursor-default select-none py-2 pl-10 pr-4 ${
                    active ? "bg-amber-100 text-amber-900" : "text-gray-900"
                  }`
                }
                value={item}
              >
                {({ selected }) => (
                  <>
                    <span
                      className={`block truncate ${
                        selected ? "font-medium" : "font-normal"
                      }`}
                    >
                      {item.label}
                    </span>
                    {selected ? (
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    ) : null}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
};

export default StyledListBox;
