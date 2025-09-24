import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  FormControl,
  FormField as ShadcnFormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Control, FieldPath, FieldValues } from 'react-hook-form';

interface BaseFormFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  placeholder?: string;
  required?: boolean;
}

interface InputFormFieldProps<T extends FieldValues>
  extends BaseFormFieldProps<T> {
  type: 'text' | 'email' | 'password' | 'number' | 'date' | 'tel';
  step?: string;
}

interface TextareaFormFieldProps<T extends FieldValues>
  extends BaseFormFieldProps<T> {
  type: 'textarea';
  rows?: number;
}

interface SelectFormFieldProps<T extends FieldValues>
  extends BaseFormFieldProps<T> {
  type: 'select';
  options: { value: string; label: string }[];
}

type FormFieldProps<T extends FieldValues> =
  | InputFormFieldProps<T>
  | TextareaFormFieldProps<T>
  | SelectFormFieldProps<T>;

const FormField = <T extends FieldValues>(props: FormFieldProps<T>) => {
  const { control, name, label, placeholder, required } = props;

  const baseInputClasses =
    'px-4 py-3 border border-slate-200 bg-white/80 backdrop-blur-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all duration-200 shadow-sm hover:shadow-md';
  const labelClasses = 'text-sm font-semibold text-slate-700';

  return (
    <ShadcnFormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className={labelClasses}>
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </FormLabel>
          <FormControl>
            {props.type === 'textarea' ? (
              <Textarea
                placeholder={placeholder}
                rows={props.rows || 4}
                className={`${baseInputClasses} resize-none`}
                {...field}
              />
            ) : props.type === 'select' ? (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger className={baseInputClasses}>
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                  {props.options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                type={props.type}
                placeholder={placeholder}
                step={props.type === 'number' ? props.step : undefined}
                className={baseInputClasses}
                {...field}
              />
            )}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormField;
