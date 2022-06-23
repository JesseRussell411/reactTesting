export default function lazy<T>(original: () => T) {
    let supplier = () => {
        try {
            const result = original();
            supplier = () => result;
            return result;
        } catch (e) {
            supplier = () => {
                throw e;
            };
            throw e;
        }
    };

    return () => supplier();
}
