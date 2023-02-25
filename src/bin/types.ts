export interface IApp {
    bootstrap(): Promise<void>;

    serve(): Promise<void>;

    // down(): Promise<void>;
}
