# Troubleshooting Guide: White Screen & Infinite Loading

## Problem: "White Screen" or "Loading..." Indefinitely
The application appears stuck on a loading state or renders nothing, with no errors in the console.

### Common Causes & Fixes

#### 1. Infinite Loading in Custom Hooks
**Symptom:** The component relies on a hook like `useFamilyData` which never sets `loading: false`.
**Cause:** Early returns in `useEffect` prevent the cleanup or final state update.
**Fix:** Ensure all code paths in `useEffect` eventually update the loading state.

```typescript
// BAD
useEffect(() => {
    if (!profile) return // Loading stays true forever!
    fetchData().then(() => setLoading(false))
}, [profile])

// GOOD
useEffect(() => {
    if (!profile) {
        setLoading(false) // Handle the "no data" case
        return
    }
    fetchData().then(() => setLoading(false))
}, [profile])
```

#### 2. Undefined/Null Objects in Rendering
**Symptom:** React crashes silently during render loop.
**Cause:** Accessing properties of `undefined` (e.g., `user.name` when `user` is null).
**Fix:** Use optional chaining (`?.`) or default values.

```typescript
// BAD
<span>{user.name}</span>

// GOOD
<span>{user?.name || 'Guest'}</span>
```

#### 3. Date Object Issues
**Symptom:** Components (especially Charts) failing to render.
**Cause:** Passing `NaN` or invalid `Date` objects to libraries.
**Fix:** Always validate dates before passing them to heavy components.

```typescript
if (isNaN(myDate.getTime())) return null
```

#### 4. Circular Dependencies / Infinite Re-renders
**Symptom:** Browser freezes or crashes tab.
**Cause:** Updating state in `useEffect` that triggers the same effect.
**Fix:** Check `useEffect` dependency arrays carefully.

## Best Practices
1.  **Always Handle "Empty" States:** If a hook depends on data that might act be there yet, explicitly handle the `null` case.
2.  **Defensive Coding:** Assume props might be missing.
3.  **ErrorBoundary:** Implement a React Error Boundary to catch render crashes and show a friendly UI instead of a white screen.
