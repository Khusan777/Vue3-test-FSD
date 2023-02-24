# **Validating ref**
Accepts this rules
```typescript
'required' | 'email' | 'numeric' | 'date' | 'minLength' | 'maxLength';
```
Returns an object
```typescript
return reactive({
  model,      // Value that you must assign to v-model
  isValid,    // Bacome true if all rules becomes true
  modelRules, // An object that have a rules state,
              // For example, { required: true, minLength: false }
});
```

## **How to use it**

### **First**
Import `validateRef` function
```javascript
import { validateRef } from "~/plugins/aliftech-ui/validations/validateRef/validateRef"
```

### **Second**
Assign this function to your variable and put two parameters
* First is your model
* Second is your validations
```javascript
setup() {
  ...
  const phone = validateRef('', ['required', 'numeric', { type: "maxLength", value: 12 }])
  ...
}
```

### **Third**
Assign variable's `model` value to your `v-model`
```html
<input ... v-model="phone.model" ... />
```

## That's all 😁

Now you can control you variable and set messages you need by modelRules object parameters