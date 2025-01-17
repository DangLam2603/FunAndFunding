import { TextField, MenuItem, Select, FormControl, InputLabel, InputAdornment, Grid2 } from "@mui/material";

const FormField = ({ field, register, errors }) => {
  const renderInputField = (input, index) => {
    const { name, placeholder, inputeType, postFix } = input;
    const error = errors[name];

    switch (inputeType) {
      case 'select':
        return (
          <FormControl fullWidth key={index} variant="outlined" error={!!error}>
            <InputLabel>{placeholder}</InputLabel>
            <Select
              label={placeholder}
              {...register(name, { required: `${placeholder} is required` })}
            >
              <MenuItem value="category1">Category 1</MenuItem>
              <MenuItem value="category2">Category 2</MenuItem>
            </Select>
            {error && <p className="text-red-600">{error.message}</p>}
          </FormControl>
        );
      case 'string':
        return (
          <TextField
            {...register(name, { required: `${placeholder} is required` })}
            placeholder={placeholder}
            fullWidth
            variant="outlined"
            error={!!error}
            helperText={error ? error.message : ''}
            key={index}
          />
        );
      case 'textarea':
        return (
          <TextField
            {...register(name, { required: `${placeholder} is required` })}
            placeholder={placeholder}
            multiline
            rows={4}
            fullWidth
            variant="outlined"
            error={!!error}
            helperText={error ? error.message : ''}
            key={index}
          />
        );
      case 'datetime':
        return (
          <TextField
            {...register(name, { required: `${placeholder} is required` })}
            placeholder={placeholder}
            type="datetime-local"
            fullWidth={false}
            InputLabelProps={{ shrink: true }}
            error={!!error}
            helperText={error ? error.message : ''}
            key={index}
          />
        );
      case 'number':
        return (
          <TextField
            {...register(name, { required: `${placeholder} is required`, min: 0 })}
            placeholder={placeholder}
            type="number"
            InputProps={{
              endAdornment: postFix ? <InputAdornment position="end">{postFix}</InputAdornment> : null,
              inputProps: { min: '0' },
            }}
            fullWidth
            variant="outlined"
            error={!!error}
            helperText={error ? error.message : ''}
            key={index}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Grid2 container spacing={4} className="my-8">
      <Grid2 item xs={12} md={4}>
        <h4 className="font-semibold text-sm">{field.fieldTitle}</h4>
        <p className="text-gray-500 text-xs">{field.fieldDescription}</p>
      </Grid2>
      <Grid2 item xs={12} md={8}>
        {field.inputs.map((input, index) => renderInputField(input, index))}
      </Grid2>
    </Grid2>
  );
};

export default FormField;
