'use client';
import { useState, useMemo, useCallback, useEffect } from 'react';
import type { Product } from '@/types/product';
import { sortProducts } from '@/utils/inventory';
import { openWhatsApp, buildSizeNotifyMessage } from '@/utils/whatsapp';
import { fetchLiveCatalog, logRuntimeApi } from '@/utils/api-products';
import SearchInput from './SearchInput';
import SortSelect, { type SortOption } from './SortSelect';
import FilterRail, { type ActiveFilters } from './FilterRail';
import FilterSheet from './FilterSheet';
import ProductCard from '@/components/product/ProductCard';
import ProductCardFeatured from '@/components/product/ProductCardFeatured';
import EmptyState from '@/components/ui/EmptyState';
import Skeleton from '@/components/ui/Skeleton';
import DemandCaptureWhatsApp from './DemandCaptureWhatsApp';
import styles from './CatalogClient.module.css';

const PAGE_SIZE = 12;

interface Props {
  initialQuery?: string;
}

export default function CatalogClient({ initialQuery = '' }: Props) {
  const [runtimeProducts, setRuntimeProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const [query,       setQuery]       = useState(initialQuery);
  const [sort,        setSort]        = useState<SortOption>('recent');
  const [sheetOpen,   setSheetOpen]   = useState(false);
  const [page,        setPage]        = useState(1);
  const [filters, setFilters] = useState<ActiveFilters>({
    brands: [], sizes: [], statuses: [], conditions: [],
  });

  useEffect(() => {
    let cancelled = false;

    async function loadCatalog() {
      setLoading(true);
      setApiError(null);
      try {
        const liveProducts = await fetchLiveCatalog();
        if (!cancelled) {
          setRuntimeProducts(liveProducts);
        }
      } catch (error) {
        logRuntimeApi('catalog load failed', error);
        if (!cancelled) {
          setRuntimeProducts([]);
          setApiError('No pudimos cargar el catalogo en vivo.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadCatalog();

    return () => {
      cancelled = true;
    };
  }, []);

  const activeProducts = runtimeProducts.length > 0 || !loading ? runtimeProducts : [];
  const activeBrands = useMemo(
    () => [...new Set(activeProducts.map((product) => product.brand))].sort(),
    [activeProducts]
  );
  const activeSizes = useMemo(
    () => [...new Set(activeProducts.flatMap(getProductMxSizes))].sort((a, b) => a - b),
    [activeProducts]
  );

  const activeCount =
    filters.brands.length + filters.sizes.length +
    filters.statuses.length + filters.conditions.length;

  const filtered = useMemo(() => {
    let list = [...activeProducts];

    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (p) =>
          p.model.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }
    if (filters.brands.length)     list = list.filter((p) => filters.brands.includes(p.brand));
    if (filters.sizes.length)      list = list.filter((p) => getProductMxSizes(p).some((size) => filters.sizes.includes(size)));
    if (filters.statuses.length)   list = list.filter((p) => filters.statuses.includes(p.status));
    if (filters.conditions.length) list = list.filter((p) => filters.conditions.includes(p.condition));

    return sortProducts(list, sort);
  }, [activeProducts, query, filters, sort]);

  const featured   = filtered.find((p) => p.status === 'available') ?? null;
  const gridItems  = filtered.filter((p) => p !== featured);
  const visible    = gridItems.slice(0, page * PAGE_SIZE);
  const hasMore    = visible.length < gridItems.length;

  const handleFiltersChange = useCallback((next: ActiveFilters) => {
    setFilters(next);
    setPage(1);
  }, []);

  const handleQuery = useCallback((v: string) => {
    setQuery(v);
    setPage(1);
  }, []);

  const handleEmptySizeAction = () => {
    const activeSize = filters.sizes[0];
    if (activeSize) openWhatsApp(buildSizeNotifyMessage(activeSize));
  };

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerRow}>
          <div className={styles.headerLeft}>
            <p className={styles.eyebrow}>Selección privada · Inventario limitado</p>
            <h1 className={styles.count}>
              {filtered.length} {filtered.length === 1 ? 'par' : 'pares'}
            </h1>
            <p className={styles.tagline}>Piezas únicas, verificadas una por una.</p>
          </div>

          <div className={styles.headerRight}>
            <SearchInput value={query} onChange={handleQuery} />
            <SortSelect value={sort} onChange={(v) => { setSort(v); setPage(1); }} />
          </div>
        </div>
      </div>

      {/* Desktop filter rail */}
      <div className={styles.filterWrap}>
        <FilterRail
          brands={activeBrands}
          sizes={activeSizes}
          active={filters}
          onChange={handleFiltersChange}
        />
      </div>

      {/* Mobile filter bar */}
      <div className={styles.mobileBar}>
        <button
          type="button"
          className={styles.mobileBtn}
          onClick={() => setSheetOpen(true)}
        >
          <svg width="12" height="10" viewBox="0 0 12 10" fill="none" aria-hidden="true">
            <path d="M1 1h10M3 5h6M5 9h2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
          Filtrar
          {activeCount > 0 && (
            <span className={styles.mobileBadge}>{activeCount}</span>
          )}
        </button>
      </div>

      {/* Filter sheet (mobile) */}
      <FilterSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        brands={activeBrands}
        sizes={activeSizes}
        active={filters}
        onApply={handleFiltersChange}
      />

      {/* Grid */}
      {loading ? (
        <div className={styles.grid} aria-busy="true" aria-label="Cargando catalogo">
          <div className={styles.featuredSlot}>
            <Skeleton height={260} radius="var(--rk-radius-md)" />
          </div>
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} height={360} radius="var(--rk-radius-md)" />
          ))}
        </div>
      ) : apiError ? (
        <EmptyState
          heading={apiError}
          body="Intenta recargar la pagina. Si el problema continua, escribenos por WhatsApp."
          actionLabel="Preguntar por WhatsApp"
          onAction={() => openWhatsApp('Hola, no pude ver el catalogo de RKicks. Me ayudas con los pares disponibles?')}
        />
      ) : filtered.length === 0 ? (
        <>
          <EmptyState
            heading={query ? `Sin resultados para "${query}".` : 'Sin pares con ese filtro.'}
            body={query ? undefined : 'Intenta con otra talla o marca.'}
            actionLabel={filters.sizes.length > 0 ? 'Notificarme' : 'Limpiar filtros'}
            onAction={
              filters.sizes.length > 0
                ? handleEmptySizeAction
                : () => handleFiltersChange({ brands: [], sizes: [], statuses: [], conditions: [] })
            }
          />
          <div className={styles.demandCapture}>
            <DemandCaptureWhatsApp />
          </div>
        </>
      ) : (
        <div className={styles.grid}>
          {featured && (
            <div className={styles.featuredSlot}>
              <ProductCardFeatured product={featured} />
            </div>
          )}
          {visible.map((product) => (
            <ProductCard key={product.id} product={product} variant="grid" />
          ))}
        </div>
      )}

      {hasMore && (
        <div className={styles.loadMore}>
          <button
            type="button"
            className={styles.loadMoreBtn}
            onClick={() => setPage((p) => p + 1)}
          >
            Cargar más
          </button>
        </div>
      )}
    </div>
  );
}

function getProductMxSizes(product: Product): number[] {
  const variantSizes = product.variants
    .map((variant) => Number(String(variant.sizeMx ?? variant.sizeLabel).match(/\d+(?:\.\d+)?/)?.[0] ?? ''))
    .filter((size) => Number.isFinite(size) && size > 0);

  if (variantSizes.length > 0) return variantSizes;
  return product.size.cm > 0 ? [product.size.cm] : [];
}
