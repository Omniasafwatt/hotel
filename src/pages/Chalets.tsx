import { useTranslation } from 'react-i18next';
import { useAppSelector } from '../hooks/useAppSelector';
import { selectFilteredChalets } from '../store/slices/chaletsSlice';
import { ChaletCard } from '../components/chalets/ChaletCard';
import { ChaletFilter } from '../components/chalets/ChaletFilter';

export function Chalets() {
  const { t } = useTranslation();
  const filtered = useAppSelector(selectFilteredChalets);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{t('chalets.title')}</h1>
        <p className="text-gray-500 mt-2">{t('chalets.subtitle')}</p>
      </div>

      {/* Filters */}
      <div className="mb-8">
        <ChaletFilter />
      </div>

      {/* Results count */}
      <p className="text-sm text-gray-500 mb-5">{filtered.length} properties found</p>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-400 text-lg">{t('chalets.no_results')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((chalet) => (
            <ChaletCard key={chalet.id} chalet={chalet} />
          ))}
        </div>
      )}
    </div>
  );
}
