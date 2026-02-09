import { Select as SelectPrimitive } from 'bits-ui';
import Content from './select-content.svelte';
import Item from './select-item.svelte';
import Trigger from './select-trigger.svelte';

const Root = SelectPrimitive.Root;
const Group = SelectPrimitive.Group;
const Input = SelectPrimitive.Input;
const Label = SelectPrimitive.Label;
const Value = SelectPrimitive.Value;
const ItemIndicator = SelectPrimitive.ItemIndicator;

export {
	Root,
	Group,
	Input,
	Label,
	Value,
	Content,
	Item,
	Trigger,
	ItemIndicator,
	//
	Root as Select,
	Group as SelectGroup,
	Input as SelectInput,
	Label as SelectLabel,
	Value as SelectValue,
	Content as SelectContent,
	Item as SelectItem,
	Trigger as SelectTrigger,
	ItemIndicator as SelectItemIndicator
};
