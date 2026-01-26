import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import * as Tooltip from '@radix-ui/react-tooltip';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import * as Tabs from '@radix-ui/react-tabs';
import * as Switch from '@radix-ui/react-switch';
import * as Checkbox from '@radix-ui/react-checkbox';
import * as Select from '@radix-ui/react-select';
import * as Slider from '@radix-ui/react-slider';
import * as Progress from '@radix-ui/react-progress';
import * as Accordion from '@radix-ui/react-accordion';

/**
 * RadixDemo - A component to verify Radix UI installation
 * This demonstrates that all major Radix packages are properly installed
 */
export default function RadixDemo() {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [switchChecked, setSwitchChecked] = React.useState(false);
  const [sliderValue, setSliderValue] = React.useState([50]);
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    const timer = setTimeout(() => setProgress(66), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8" data-testid="radix-demo">
      <h1 className="text-3xl font-bold text-gray-900">Radix UI Demo</h1>
      <p className="text-gray-600">All Radix UI components are installed and working:</p>

      {/* Tooltip Provider wraps components that use tooltips */}
      <Tooltip.Provider>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Tooltip Demo */}
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">Tooltip</h3>
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                  Hover me
                </button>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content
                  className="bg-gray-900 text-white px-3 py-1.5 rounded text-sm"
                  sideOffset={5}
                >
                  This is a Radix tooltip!
                  <Tooltip.Arrow className="fill-gray-900" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          </div>

          {/* Dialog Demo */}
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">Dialog</h3>
            <Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
              <Dialog.Trigger asChild>
                <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                  Open Dialog
                </button>
              </Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/50" />
                <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 w-96 shadow-xl">
                  <Dialog.Title className="text-lg font-bold">Dialog Title</Dialog.Title>
                  <Dialog.Description className="text-gray-600 mt-2">
                    This is a Radix dialog component.
                  </Dialog.Description>
                  <Dialog.Close asChild>
                    <button className="mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
                      Close
                    </button>
                  </Dialog.Close>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
          </div>

          {/* Switch Demo */}
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">Switch</h3>
            <div className="flex items-center gap-2">
              <Switch.Root
                checked={switchChecked}
                onCheckedChange={setSwitchChecked}
                className="w-11 h-6 bg-gray-200 rounded-full relative data-[state=checked]:bg-blue-500"
              >
                <Switch.Thumb className="block w-5 h-5 bg-white rounded-full shadow transition-transform translate-x-0.5 data-[state=checked]:translate-x-5" />
              </Switch.Root>
              <span>{switchChecked ? 'On' : 'Off'}</span>
            </div>
          </div>

          {/* Checkbox Demo */}
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">Checkbox</h3>
            <div className="flex items-center gap-2">
              <Checkbox.Root
                className="w-5 h-5 border-2 border-gray-300 rounded flex items-center justify-center data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                defaultChecked
              >
                <Checkbox.Indicator>
                  <svg className="w-3 h-3 text-white" viewBox="0 0 12 12">
                    <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" fill="none" />
                  </svg>
                </Checkbox.Indicator>
              </Checkbox.Root>
              <label>Check me</label>
            </div>
          </div>

          {/* Slider Demo */}
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">Slider: {sliderValue[0]}</h3>
            <Slider.Root
              className="relative flex items-center w-full h-5"
              value={sliderValue}
              onValueChange={setSliderValue}
              max={100}
              step={1}
            >
              <Slider.Track className="bg-gray-200 relative grow rounded-full h-2">
                <Slider.Range className="absolute bg-blue-500 rounded-full h-full" />
              </Slider.Track>
              <Slider.Thumb className="block w-5 h-5 bg-white shadow-lg rounded-full border-2 border-blue-500 focus:outline-none" />
            </Slider.Root>
          </div>

          {/* Progress Demo */}
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">Progress: {progress}%</h3>
            <Progress.Root
              className="relative overflow-hidden bg-gray-200 rounded-full w-full h-4"
              value={progress}
            >
              <Progress.Indicator
                className="bg-blue-500 h-full transition-transform duration-500"
                style={{ transform: `translateX(-${100 - progress}%)` }}
              />
            </Progress.Root>
          </div>

          {/* Dropdown Menu Demo */}
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">Dropdown Menu</h3>
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600">
                  Open Menu
                </button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  className="bg-white rounded-lg shadow-lg p-2 min-w-[160px]"
                  sideOffset={5}
                >
                  <DropdownMenu.Item className="px-3 py-2 rounded cursor-pointer hover:bg-gray-100 outline-none">
                    Item 1
                  </DropdownMenu.Item>
                  <DropdownMenu.Item className="px-3 py-2 rounded cursor-pointer hover:bg-gray-100 outline-none">
                    Item 2
                  </DropdownMenu.Item>
                  <DropdownMenu.Separator className="h-px bg-gray-200 my-1" />
                  <DropdownMenu.Item className="px-3 py-2 rounded cursor-pointer hover:bg-gray-100 outline-none text-red-500">
                    Delete
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          </div>

          {/* Select Demo */}
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">Select</h3>
            <Select.Root>
              <Select.Trigger className="inline-flex items-center justify-between px-4 py-2 bg-white border rounded w-48">
                <Select.Value placeholder="Select an option" />
                <Select.Icon>▼</Select.Icon>
              </Select.Trigger>
              <Select.Portal>
                <Select.Content className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <Select.Viewport className="p-2">
                    <Select.Item value="option1" className="px-3 py-2 rounded cursor-pointer hover:bg-gray-100 outline-none">
                      <Select.ItemText>Option 1</Select.ItemText>
                    </Select.Item>
                    <Select.Item value="option2" className="px-3 py-2 rounded cursor-pointer hover:bg-gray-100 outline-none">
                      <Select.ItemText>Option 2</Select.ItemText>
                    </Select.Item>
                    <Select.Item value="option3" className="px-3 py-2 rounded cursor-pointer hover:bg-gray-100 outline-none">
                      <Select.ItemText>Option 3</Select.ItemText>
                    </Select.Item>
                  </Select.Viewport>
                </Select.Content>
              </Select.Portal>
            </Select.Root>
          </div>

        </div>

        {/* Tabs Demo */}
        <div className="p-4 border rounded-lg">
          <h3 className="font-semibold mb-2">Tabs</h3>
          <Tabs.Root defaultValue="tab1">
            <Tabs.List className="flex border-b">
              <Tabs.Trigger
                value="tab1"
                className="px-4 py-2 border-b-2 border-transparent data-[state=active]:border-blue-500"
              >
                Tab 1
              </Tabs.Trigger>
              <Tabs.Trigger
                value="tab2"
                className="px-4 py-2 border-b-2 border-transparent data-[state=active]:border-blue-500"
              >
                Tab 2
              </Tabs.Trigger>
              <Tabs.Trigger
                value="tab3"
                className="px-4 py-2 border-b-2 border-transparent data-[state=active]:border-blue-500"
              >
                Tab 3
              </Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content value="tab1" className="p-4">Content for Tab 1</Tabs.Content>
            <Tabs.Content value="tab2" className="p-4">Content for Tab 2</Tabs.Content>
            <Tabs.Content value="tab3" className="p-4">Content for Tab 3</Tabs.Content>
          </Tabs.Root>
        </div>

        {/* Accordion Demo */}
        <div className="p-4 border rounded-lg">
          <h3 className="font-semibold mb-2">Accordion</h3>
          <Accordion.Root type="single" collapsible className="space-y-2">
            <Accordion.Item value="item-1" className="border rounded">
              <Accordion.Trigger className="w-full px-4 py-3 text-left font-medium hover:bg-gray-50">
                Section 1
              </Accordion.Trigger>
              <Accordion.Content className="px-4 py-3 text-gray-600">
                Content for section 1. This is a Radix Accordion component.
              </Accordion.Content>
            </Accordion.Item>
            <Accordion.Item value="item-2" className="border rounded">
              <Accordion.Trigger className="w-full px-4 py-3 text-left font-medium hover:bg-gray-50">
                Section 2
              </Accordion.Trigger>
              <Accordion.Content className="px-4 py-3 text-gray-600">
                Content for section 2. Fully accessible and customizable.
              </Accordion.Content>
            </Accordion.Item>
          </Accordion.Root>
        </div>

      </Tooltip.Provider>

      <div className="text-center text-green-600 font-semibold" data-testid="radix-success">
        All Radix UI components loaded successfully!
      </div>
    </div>
  );
}
