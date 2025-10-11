# Haptic Feedback Implementation

## Overview
Haptic feedback provides tactile responses to user interactions, enhancing the mobile user experience by confirming actions and providing sensory feedback.

## Implementation Date
2025-10-11

## Technology
- **Capacitor Haptics API**: Native haptic feedback for iOS and Android
- **Web Vibration API**: Fallback for web browsers that support vibration
- **Graceful Degradation**: Silently fails on platforms without support

## Haptic Service

### Location
`src/services/hapticService.ts`

### Available Methods

#### Impact Feedback
- **`light()`**: Subtle tactile feedback
  - Use for: Hover effects, selection changes, minor UI updates
  - Intensity: Light
  
- **`medium()`**: Standard tactile feedback
  - Use for: Button clicks, toggles, standard actions
  - Intensity: Medium
  
- **`heavy()`**: Strong tactile feedback
  - Use for: Confirmation actions, important buttons, destructive actions
  - Intensity: Heavy

#### Notification Feedback
- **`success()`**: Success pattern
  - Use for: Successful form submissions, completed tasks, confirmations
  - Pattern: Success notification
  
- **`warning()`**: Warning pattern
  - Use for: Validation warnings, important notices
  - Pattern: Warning notification
  
- **`error()`**: Error pattern
  - Use for: Failed actions, errors, destructive confirmations
  - Pattern: Error notification

#### Selection Feedback
- **`selectionChanged()`**: Selection changed pattern
  - Use for: Picker changes, slider movements, selection updates, toggle switches
  - Pattern: Selection change

#### Custom Vibration
- **`vibratePattern(pattern)`**: Custom vibration pattern (web fallback)
  - Use for: Custom patterns when Capacitor isn't available
  - Parameter: Number (duration in ms) or array of numbers

## Hook Usage

### Location
`src/hooks/useHaptics.ts`

### Example Usage

```tsx
import { useHaptics } from '@/hooks/useHaptics';

const MyComponent = () => {
  const haptics = useHaptics();

  const handleClick = () => {
    haptics.medium();
    // Your click logic
  };

  const handleSuccess = () => {
    haptics.success();
    // Your success logic
  };

  const handleError = () => {
    haptics.error();
    // Your error logic
  };

  return (
    <button onClick={handleClick}>
      Click me
    </button>
  );
};
```

### Using the Trigger Method

```tsx
const haptics = useHaptics();

// Trigger by type
haptics.trigger('medium');
haptics.trigger('success');
haptics.trigger('error');
```

## Automatic Integration

### Button Component
All buttons automatically trigger haptic feedback on click:
- **Default/Hero/Premium buttons**: Medium impact (configurable)
- **Destructive buttons**: Heavy impact
- **Other variants**: Light impact
- **Opt-out**: Set `haptic="none"` prop

```tsx
// Automatic medium haptic
<Button onClick={handleClick}>Click me</Button>

// Heavy haptic for destructive
<Button variant="destructive" onClick={handleDelete}>Delete</Button>

// Disable haptic
<Button haptic="none" onClick={handleClick}>Silent</Button>

// Custom haptic intensity
<Button haptic="heavy" onClick={handleImportant}>Important</Button>
```

### Checkbox Component
Automatically triggers light haptic on toggle:

```tsx
<Checkbox 
  checked={isChecked}
  onCheckedChange={setIsChecked}
/>
```

### Switch Component
Automatically triggers selection changed haptic on toggle:

```tsx
<Switch 
  checked={enabled}
  onCheckedChange={setEnabled}
/>
```

### Toast Notifications
Automatically triggers haptic based on variant:
- **Success/default toasts**: Success haptic
- **Destructive toasts**: Error haptic

```tsx
const { toast } = useToast();

// Success haptic
toast({
  title: "Success",
  description: "Operation completed",
});

// Error haptic
toast({
  variant: "destructive",
  title: "Error",
  description: "Something went wrong",
});
```

## Implementation by Component

### ✅ Components with Haptic Feedback

#### UI Components
- `Button` - Automatic based on variant
- `Checkbox` - Light on toggle
- `Switch` - Selection changed on toggle
- `Toast` - Success/error based on variant

#### Future Components (Recommended)
- `Select` - Selection changed on option select
- `Slider` - Selection changed on value change
- `RadioGroup` - Light on selection
- `Tabs` - Light on tab change
- `Dialog` - Light on open/close
- `DropdownMenu` - Light on item select

## Best Practices

### When to Use Haptics

✅ **DO use haptics for:**
- Button clicks and taps
- Toggle switches and checkboxes
- Form submissions (success/error)
- Navigation transitions
- Selection changes
- Slider/picker adjustments
- Swipe actions
- Pull-to-refresh
- Important notifications

❌ **DON'T use haptics for:**
- Every hover interaction
- Continuous animations
- Passive notifications
- Background updates
- Automatic actions
- Frequently repeating events

### Intensity Guidelines

**Light:**
- Minor UI changes
- Hover effects (sparingly)
- Small selections
- Optional feedback

**Medium:**
- Standard buttons
- Menu selections
- Toggle switches
- Standard actions

**Heavy:**
- Destructive actions
- Major confirmations
- Critical alerts
- Important completions

### Accessibility Considerations

1. **User Control**: Consider adding a settings toggle to disable haptics
2. **Don't Overuse**: Too much haptic feedback can be disorienting
3. **Consistent Patterns**: Use the same haptic for similar actions
4. **Performance**: Haptics are lightweight, but avoid in tight loops

## Platform Support

### iOS
- ✅ All haptic types supported
- ✅ Impact styles: Light, Medium, Heavy
- ✅ Notification types: Success, Warning, Error
- ✅ Selection changed

### Android
- ✅ All haptic types supported
- ✅ Impact styles mapped to Android equivalents
- ✅ Notification types available
- ✅ Selection changed

### Web (Browser)
- ⚠️ Limited support via Vibration API
- ⚠️ Not all browsers support vibration
- ⚠️ User gesture required
- ✅ Graceful degradation (silently fails)

## Configuration

### Capacitor Config
Ensure Capacitor is properly configured in `capacitor.config.ts`:

```typescript
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.c29496b8b94f4984a05eae17a8a8cef8',
  appName: 'soil-sidekick-pro-guide',
  webDir: 'dist',
  server: {
    url: 'https://c29496b8-b94f-4984-a05e-ae17a8a8cef8.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    Haptics: {
      // No specific configuration needed
    }
  }
};

export default config;
```

### Sync Native Platforms
After making changes, sync to native platforms:

```bash
npx cap sync
```

## Testing

### In Lovable Preview
- Haptics will NOT work in the Lovable web preview
- This is expected - haptics require native platform

### On Physical Device
1. Export to GitHub
2. Git pull the project
3. Run `npm install`
4. Run `npx cap sync`
5. Run `npx cap run ios` or `npx cap run android`
6. Test on physical device (simulators may not support haptics)

### Testing Checklist
- [ ] Test button clicks (different variants)
- [ ] Test checkbox toggles
- [ ] Test switch toggles
- [ ] Test toast notifications (success/error)
- [ ] Test on iOS device
- [ ] Test on Android device
- [ ] Verify graceful degradation in web browser

## Performance

### Impact
- **Minimal overhead**: Haptic calls are async and non-blocking
- **Battery usage**: Negligible impact on battery life
- **User experience**: Significantly improved tactile feedback

### Optimization
- Service checks availability once at initialization
- Failed haptic calls fail silently (debug logging only)
- No performance impact on web platforms

## Future Enhancements

### Planned Features
- [ ] User preference to disable haptics
- [ ] Custom haptic patterns for specific actions
- [ ] Haptic feedback for drag-and-drop
- [ ] Haptic feedback for long-press actions
- [ ] Analytics on haptic usage patterns

### Additional Components
- [ ] Add to Select component
- [ ] Add to Slider component
- [ ] Add to RadioGroup component
- [ ] Add to Tabs component
- [ ] Add to Dialog open/close
- [ ] Add to DropdownMenu selections

## Resources

- [Capacitor Haptics Documentation](https://capacitorjs.com/docs/apis/haptics)
- [Apple Haptic Guidelines](https://developer.apple.com/design/human-interface-guidelines/playing-haptics)
- [Android Haptic Guidelines](https://developer.android.com/develop/ui/views/haptics)
- [MDN Vibration API](https://developer.mozilla.org/en-US/docs/Web/API/Vibration_API)

## User Guide Section

For deployment instructions, please see:
https://lovable.dev/blogs/TODO

After pulling from GitHub, always run:
```bash
npx cap sync
```

This ensures native platform plugins are properly synchronized.
