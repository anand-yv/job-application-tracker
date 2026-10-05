import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { applications } from "../services/applications";
import styles from "./Dashboard.module.css"
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Dropdown from "@/components/Dropdown";

const PAGE_SIZE = 10;

const Dashboard = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null)
    const navigate = useNavigate();
    const [page, setPage] = useState(0);
    const [statusFilter, setStatusFilter] = useState(null);
    const [pageData, setPageData] = useState({
        content: [],
        totalPages: 0,
    })
    const [sortBy, setSortBy] = useState(null);
    const [sortOrder, setSortOrder] = useState(null);

    const applicationsList = pageData.content;
    const totalPages = pageData.totalPages;

    const fetchApplications = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const sort = sortBy
                ? `${sortBy}${sortOrder ? `,${sortOrder}` : ""}`
                : undefined;
            const res = await applications.getAll({ page, size: PAGE_SIZE, status: statusFilter, sort });
            const data = res.data;
            setPageData({
                content: data.content || [],
                totalPages: data.totalPages
            });
        } catch (e) {
            setError(e.response?.data?.message || "Something went wrong. Please try again.");
            console.error('Error : ', e)
        } finally {
            setLoading(false);
        }
    }, [page, statusFilter, sortBy, sortOrder]);

    const handleStatusChange = (value) => {
        setStatusFilter(value === "ALL" ? null : value);
        setPage(0);
    }

    const handleSortByChange = (value) => {
        setSortBy(value === "NONE" ? null : value);
        if (value === "NONE") {
            setSortOrder(null);
        }
        setPage(0);
    }

    const handleSortOrderChange = (value) => {
        setSortOrder(value);
        setPage(0);
    }

    useEffect(() => {
        fetchApplications();
    }, [fetchApplications])


    return (<>
        <div className={styles["container"]}>
            <div className={styles["header"]}>
                <h5>Applications </h5>
                <Button onClick={fetchApplications}>Refresh</Button>
                <Button onClick={() => navigate("/applications/new")}>Create Application</Button>
            </div>

            <div className={styles["display-list"]}>
                <div className={styles["status-filter"]}>
                    <Label htmlFor="status">STATUS : </Label>
                    <Dropdown
                        id={"status"}
                        value={statusFilter || "ALL"}
                        onChange={handleStatusChange}
                        placeholder="Select status to filter"
                        options={[
                            { value: "ALL", label: "All Statuses" },
                            { value: "APPLIED", label: "Applied" },
                            { value: "SCREENING", label: "Screening" },
                            { value: "INTERVIEW", label: "Interview" },
                            { value: "OFFER", label: "Offer" },
                            { value: "REJECTED", label: "Rejected" },
                            { value: "WITHDRAWN", label: "Withdrawn" },
                        ]}
                    />
                </div>

                <div className={styles["sort"]}>
                    <div className={styles["status-filter"]}>
                        <Label htmlFor="sortBy">SORT BY: </Label>
                        <Dropdown
                            id={"sortBy"}
                            value={sortBy || "NONE"}
                            onChange={handleSortByChange}
                            placeholder={"Select field for sorting"}
                            options={[
                                { value: "NONE", label: "NONE" },
                                { value: "appliedDate", label: "APPLIED DATE" },
                                { value: "company", label: "COMPANY" },
                            ]}
                        />
                        <Label htmlFor="orderBy">SORT ORDER:</Label>
                        <Dropdown
                            id={"orderBy"}
                            value={sortOrder}
                            onChange={handleSortOrderChange}
                            placeholder={"Select direction for sorting"}
                            options={[
                                { value: "asc", label: "ASCENDING" },
                                { value: "desc", label: "DESCENDING" }
                            ]}
                            disabled={!sortBy}
                        />
                    </div>
                </div>

            </div>

            {loading ? <p>Loading....</p> :
                error ? <p>{error}</p> :
                    <div className={styles["application-list"]}>
                        {applicationsList.length > 0 ? applicationsList.map((application, index) => {
                            const displayIndex = page * PAGE_SIZE + index + 1;
                            return (
                                <div key={application.id} className={styles["application-link"]}>
                                    <p className={styles["application-link-index"]} >{displayIndex}</p>
                                    <Link to={`/applications/${application.id}`} className={styles["application-field"]}>
                                        <p>Role : {application.roleTitle}</p>
                                        <p>Company : {application.company}</p>
                                        <p>Status : {application.status}</p>
                                    </Link>
                                </div>
                            )
                        }) :
                            <h4>No Applications. Add Application</h4>}
                    </div>
            }

            {totalPages > 0 &&
                <div className={styles["page-count"]}>
                    <Button disabled={page <= 0} onClick={() => setPage((prev) => (prev - 1))}>PREV</Button>
                    <div>{page + 1}</div>
                    /
                    <div>{totalPages}</div>
                    <Button disabled={page + 1 >= totalPages} onClick={() => setPage((prev) => (prev + 1))}>NEXT</Button>
                </div>
            }
        </div>
    </>)
}

export default Dashboard;