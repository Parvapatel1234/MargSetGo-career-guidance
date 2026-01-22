export default function Footer() {
    return (
        <footer className="bg-gray-50 border-t">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="mb-4 md:mb-0">
                        <span className="text-xl font-bold text-gray-800">MargSetGo</span>
                        <p className="text-sm text-gray-500 mt-1">Guiding Your Career Path</p>
                    </div>
                    <div className="text-sm text-gray-500">
                        &copy; {new Date().getFullYear()} MargSetGo. All rights reserved.
                    </div>
                </div>
            </div>
        </footer>
    );
}
